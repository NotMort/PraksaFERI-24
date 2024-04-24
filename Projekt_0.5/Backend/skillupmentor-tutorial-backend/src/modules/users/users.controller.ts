import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PaginatedResult } from "interfaces/paginated-result.interface";
import { UserService } from "./users.service";
import { User } from "entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { isFileExtensionSafe, removeFile, saveImageToStorage } from "helpers/imgStorage";
import { join } from "path";
import { HasPremission } from "decorators/has-premission.decorator";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController{
    constructor(private readonly userService:UserService){

    }
    @ApiCreatedResponse({description:'list of all users'})
    @ApiBadRequestResponse({description:'error for users list of users'})
    @Get()
    @HasPremission('users')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page:number): Promise<PaginatedResult>{
        return this.userService.paginate(page,['role'])
    }
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id:string): Promise<User>{
        return this.userService.findById(id)
    }
    @ApiCreatedResponse({description:'create user'})
    @ApiBadRequestResponse({description:'error for create users'})
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto:CreateUserDto): Promise<User>{
        return this.userService.create(createUserDto)
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('avatar',saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload(@UploadedFile() file:Express.Multer.File, @Param(':id') id:string): Promise<User>{
        const filename = file?.filename
        if(!filename) 
            throw new BadRequestException('Wrong type of file')
        const imagesFolderPath = join(process.cwd(),'file')
        const fullImagePath = join(imagesFolderPath+'/'+file.filename)
        if(await isFileExtensionSafe(fullImagePath)){
            return this.userService.updateUserImageId(id,filename)
        }
        removeFile(fullImagePath)
        throw new BadRequestException('dosnt match extanction')
            
    }
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id:string, @Body() updateUserDto:UpdateUserDto):Promise<User>{
        return this.userService.update(id, updateUserDto)
    }
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id:string):Promise<User>{
        return this.userService.remove(id)
    }
}