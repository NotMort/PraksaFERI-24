import { IsNotEmpty, IsOptional, isNotEmpty } from "class-validator";

export class CreateUpdateProductDto{
    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    discription: string
    @IsNotEmpty()
    image: string
    @IsOptional()
    price?: number
}