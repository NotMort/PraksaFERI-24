import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "entities/user.entity";
import { AbstractService } from "modules/common/abstract.servive";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { compareHash } from "utils/bcrypt";
import { hash } from "typeorm/util/StringUtils.js";
import { postgresErrorCode } from "helpers/postgresErrorCode.enume";
import { object } from "@hapi/joi";

@Injectable()
export class UserService extends AbstractService{
    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){
        super(userRepository)
    }
    async create(createUserDto:CreateUserDto):Promise<User>{
        const user = await this.findBy({email:createUserDto.email})
        if(user){
            throw new BadRequestException('User with tath email alrady exists')
        }
        try{
            const newUser = this.userRepository.create({...createUserDto,role:{id:createUserDto.role_id}})
            return this.userRepository.save(newUser)
        }catch(error){
            Logger.error(error)
            throw new BadRequestException(`${error} happened`)
        }
    }
    async update(id:string,updateUserDto:UpdateUserDto):Promise<User>{
        const user= await this.findById(id) as User
        const {email,password,confirm_password,role_id,...data} = updateUserDto
        if(user.email !== email && email){
            user.email = email
        } else if(email && user.email ===email){
            throw new BadRequestException('email in use')
        }
        if(password && confirm_password){
            if(password!==confirm_password){
                throw new BadRequestException('Passwords do not match')
            }
            if(await compareHash(password,user.password)){
                throw new BadRequestException('New password cant be the same as old')
            }
            user.password = await hash(password)
        }
        if(role_id){
            user.role = {...user.role,id:role_id}
           try {
                Object.entries(data).map((entry)=>{
                    user[entry[0]] = entry[1]
                })
                return this.userRepository.save(user)
           } catch (error) {
                Logger.error(error)
                if(error?.code === postgresErrorCode.UniqueViolation){
                    throw new BadRequestException('user with that email alrady exists')
                }
                throw new InternalServerErrorException('Somthing went wrong while updating the user')
           }
        }
    }
    async updateUserImageId(id:string,avatar:string):Promise<User>{
        const user = await this.findById(id)
        return this.update(user.id, {avatar})
    }
}