import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "entities/user.entity";
import Logging from "library/Logging";
import { UserService } from "modules/users/users.service";
import { compareHash, hash } from "utils/bcrypt";
import { RegisterUserDto } from "./dto/register-user.dto";
import { Request, Response } from "express";
import { JwtType } from "interfaces/auth.inerface";
 


@Injectable()
export class AuthService{
    constructor(private userService:UserService,private jwtService:JwtService){}
    async validateUser(email:string,password:string): Promise<User>{
        Logging.info('valedating user...')
        const user = await this.userService.findBy({email:email})
        if(!user){
            throw new BadRequestException('Invalide inoformation')
        }
        if(!(await compareHash(password,user.password))){
            throw new BadRequestException('Invalide password')
        }
        Logging.info('user is valid')
        return user
    }
async register(registerUserDto:RegisterUserDto):Promise<User>{
    const hashedPassword = await hash(registerUserDto.password)
    return await this.userService.create({
        role_id: null,
        ...registerUserDto,
        password: hashedPassword,
    })
    }
    async login(userFromRequest:User,res:Response):Promise<void>{
        const {password,...user} = await this.userService.findById(userFromRequest.id,['role'])
        const accessToken = await this.generateToken(user.id,user.email,JwtType.ACCESS_TOKEN)
        const accessTokenCookie= await this.generateCookie(accessToken,CookieType.ACCESS_TOKEN)
        const refreshToken = await this.generateToken(user.id,user.email,JwtType.REFRESH_TOKEN)
        const refreshTokenCookie = await this.generateCookie(refreshToken,CookieType.REFRESH_TOKEN)
        try {
            await this.updateRtHash(user.id,refreshToken)
            res.setHeader('Set-Cookie',[accessTokenCookie,refreshTokenCookie]).json({...user})
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('problem logging in')
        }
    }
    async generateJwt(user:User): Promise<string>{
        return this.jwtService.signAsync({sub: user.id,name: user.email})
    }
    async user(cookie:string): Promise<User>{
        const data = await this.jwtService.verifyAsync(cookie)
        return this.userService.findById(data['id'])
    }
    async getUserId(request:Request):Promise<string>{
        const user = request.user as User
        return user.id
    }


    async refreshTokens(req:Request):Promise<User>{
        const user = await this.userService.findBy({refresh_token:req.cookies.refresh_token},['role'])
        if(!user){
            throw new ForbiddenException()
        }
        try {
            await this.jwtService.verifyAsync(user.refresh_token,{
                secret: this.configService.get('JWT_REFRESH_SECRET')
            })
        } catch (error) {
            Logging.error(error)
            throw new UnauthorizedException('problem making a refres token igs')
        }
        const token = await this.generateToken(user.id,user.email,JwtType.ACCESS_TOKEN)
        const cookie = await this.generateCookie(token,CookieType.ACCESS_TOKEN)
    }
}