import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { PaginatedResult } from "interfaces/paginated-result.interface";
import { RoleService } from "./role.service";
import { CreateUpdateRoleDto } from "./dto/create-update-role.dto";
import { Role } from "entities/role.entity";

@Controller('roles')
export class RoleController{
    constructor(private roleService:RoleService){}
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Role[]>{
        return this.roleService.findAll( ['premissions'])
    }
    @Get('paginated')
    @HttpCode(HttpStatus.OK)
    async paginated(@Query('page') page:number): Promise<PaginatedResult>{
        return this.roleService.paginate(page,['promissions'])
    }
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id:string): Promise<Role>{
        return this.roleService.findById(id,['promissions'])
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createRoleDto:CreateUpdateRoleDto, @Body('premissions')premissionsIds: string[]): Promise<Role>{
        return this.roleService.create(createRoleDto,
            premissionsIds.map((id)=>({
                id,
            }))
        )
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id:string,
    @Body() updateRoleDto:CreateUpdateRoleDto,
     @Body('premissions')premissionsIds: string[]): Promise<Role>{
        return this.roleService.update(id,
            updateRoleDto,
            premissionsIds.map((id)=>({
                id,
            })),
        )
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id:string): Promise<Role>{
        return this.roleService.remove(id)
    }
}