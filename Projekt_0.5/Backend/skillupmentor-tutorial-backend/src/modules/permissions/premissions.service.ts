import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Premission } from "entities/premission.entity";
import { AbstractService } from "modules/common/abstract.servive";
import { CreatePremissionDto } from "./dto/create-premission.dto";
import Logging from "library/Logging";
import { Repository } from "typeorm";

@Injectable()
export class PremissionService extends AbstractService{
    constructor(@InjectRepository(Premission) private readonly premissionRepository:Repository<Premission>){
        super(premissionRepository)
    }

    async create(createPremissionDto:CreatePremissionDto):Promise<Premission>{
        try {
            const premission = this.premissionRepository.create(createPremissionDto)
            return this.premissionRepository.save(premission)
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('Problem making a premission')
        }
    }
}