import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Premission } from "entities/premission.entity";
import { PremissionController } from "./premissions.controller";
import { PremissionService } from "./premissions.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([Premission])
    ],
    controllers:[PremissionController],
    providers: [PremissionService],
})
export class PremissionModule{}
