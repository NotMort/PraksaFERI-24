import { Injectable,BadRequestException,InternalServerErrorException } from "@nestjs/common";
import { PaginatedResult } from "interfaces/paginated-result.interface";
import Logging from "library/Logging";
import { Repository } from "typeorm";
@Injectable()
export abstract class AbstractService{
    constructor(protected readonly repository: Repository<any>){}
    async findAll(relations=[]):Promise<any[]>{
        try{
            return this.repository.find({relations})
        }catch(error){
            Logging.error(error)
            throw new InternalServerErrorException('somthing went wrong when searching for a list of elements')
        }
    }
    async findBy(condition,relations =[]):Promise<any>{
        try{
            return this.repository.findOne({
                where: condition,
                relations
            })
        }catch(error){
            Logging.error(error)
            throw new InternalServerErrorException(`somthing went wrong when searching for a elements with condition ${condition}`)
        }
    }
    async findById(id:string,relations = []):Promise<any>{
        try{
           const element = await this.repository.findOne({
            where: {id},
            relations,
           })
           if(!element){
            throw new BadRequestException(`Canot find element with ID ${id}`)
           }
           return element
        }catch(error){
            Logging.error(error)
            throw new InternalServerErrorException(`somthing went wrong when searching for a elements with ID ${id}`)
        }
    }
    async remove(id:string){
        const element = await this.findById(id)
        try{
            return this.repository.remove(element)
        }
        catch(error){
            Logging.error(error)
            throw new InternalServerErrorException('Somthing whent wrong while removing elemnt')
        }
    }

    async paginate(page =1, relations = []): Promise<PaginatedResult>{
        const take =10
        try{
            const [data,total]= await this.repository.findAndCount({
                take,
                skip:(page-1)*take,
                relations,
            }) 
            return{
                data:data,
                meta:{
                    total,
                    page,
                    last_page: Math.ceil(total/take)
                }
            }
        }
        catch(error){
            Logging.error(error)
            throw new InternalServerErrorException('Somthing want wrong when paginating')
        }
    }
}