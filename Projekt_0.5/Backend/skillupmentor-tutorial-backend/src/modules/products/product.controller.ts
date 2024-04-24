import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { PaginatedResult } from "interfaces/paginated-result.interface";
import { Product } from "entities/product.entity";
import { CreateUpdateProductDto } from "./dto/create-update-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { isFileExtensionSafe, removeFile, saveImageToStorage } from "helpers/imgStorage";
import { join } from "path";

@Controller('products')
export class ProductController{
    constructor(private readonly protectedService:ProductService){}
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('page') page:number):Promise <PaginatedResult>{
        return this.protectedService.paginate(page)
    }
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id:string):Promise<Product>{
        return this.protectedService.findById(id)
    }



    @Post()
    @UseInterceptors(FileInterceptor('image',saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload( @UploadedFile() file:Express.Multer.File, @Param('id') productId:string):Promise<Product>{
        const filename = file?.filename
        if(!filename) 
            throw new BadRequestException('Wrong type of file')
        const imagesFolderPath = join(process.cwd(),'file')
        const fullImagePath = join(imagesFolderPath+'/'+file.filename)
        if(await isFileExtensionSafe(fullImagePath)){
            return this.protectedService.updateProductImge(productId,filename)
        }
        removeFile(fullImagePath)
        throw new BadRequestException('dosnt match extanction')
            
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto:CreateUpdateProductDto):Promise<Product>{
        return this.protectedService.create(createProductDto)
    }


    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id:string,@Body() updateProductDto:CreateUpdateProductDto):Promise<Product>{
        return this.protectedService.update(id,updateProductDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id:string): Promise<Product>{
        return this.protectedService.remove(id)
    }
}