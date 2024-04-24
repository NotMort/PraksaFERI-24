import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Premission } from "entities/premission.entity";
import { PremissionService } from "./premissions.service";
import { CreatePremissionDto } from "./dto/create-premission.dto";

@Controller('premissions')
export class PremissionController{
    constructor(private readonly premissionsService:PremissionService){

    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll():Promise<Premission[]>{
        return this.premissionsService.findAll()
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async created(@Body() createPremissionDto:CreatePremissionDto):Promise<Premission>{
        return this.premissionsService.create(createPremissionDto)
    }
}