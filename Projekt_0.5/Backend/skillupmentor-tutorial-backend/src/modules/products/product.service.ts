import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "entities/product.entity";
import { AbstractService } from "modules/common/abstract.servive";
import { Repository } from "typeorm";
import { CreateUpdateProductDto } from "./dto/create-update-product.dto";
import Logging from "library/Logging";

@Injectable()
export class ProductService extends AbstractService{
    constructor (@InjectRepository(Product) private readonly protectedRepository: Repository<Product> ){
        super(protectedRepository)
    }

    async create(createProductDto:CreateUpdateProductDto):Promise<Product>{
        try {
            const product = this.protectedRepository.create(createProductDto)
            return this.protectedRepository.save(product)
        } catch (error) {
            Logging.error(error)
            throw new BadRequestException('Problem making a product')
        }
    }
    async update(productId:string,updateproductDto:CreateUpdateProductDto): Promise<Product>{
        const product = (await this.findById(productId)) as Product
        try {
            product.title = updateproductDto.title
            product.discription = updateproductDto.discription
            product.price = updateproductDto.price
            product.image = updateproductDto.image
            
            return this.protectedRepository.save(product)
        } catch (error) {
            Logging.error(error)
            throw new InternalServerErrorException('Problem updating product')
        }
    }

    async updateProductImge(id:string, image:string):Promise<Product>{
        const product = await this.findById(id)
        return this.update(product.id,{...product,image})
    }
}