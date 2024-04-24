import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "entities/role.entity";
import Logging from "library/Logging";
import { AbstractService } from "modules/common/abstract.servive";
import { Repository } from "typeorm";
import { CreateUpdateRoleDto } from "./dto/create-update-role.dto";
import { Premission } from "entities/premission.entity";

@Injectable()
export class RoleService extends AbstractService{
    constructor(@InjectRepository(Role) private readonly roleRepository:Repository<Role>){
        super(roleRepository)
    }
    async create(createRoleDto:CreateUpdateRoleDto, premissionIds: {id:string}[]):Promise<Role>{
        try {
            const role = this.roleRepository.create({...createRoleDto,premissions:premissionIds})
            return this.roleRepository.save(role)
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('Problem making a role')
        }
    }
    async update(roleId:string,updateRoleDto:CreateUpdateRoleDto,premissionIds:{id:string}[]): Promise<Role>{
        const role = (await this.findById(roleId)) as Role
        try {
            role.name = updateRoleDto.name
            role.premissions = premissionIds as Premission[]
            return this.roleRepository.save(role)
        } catch (error) {
            Logging.error(error)
            throw new InternalServerErrorException('Problem updating role')
        }
    }
}