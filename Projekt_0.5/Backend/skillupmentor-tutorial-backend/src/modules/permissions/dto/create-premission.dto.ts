import { IsNotEmpty } from "class-validator";

export class CreatePremissionDto{
    @IsNotEmpty()
    name:string
}