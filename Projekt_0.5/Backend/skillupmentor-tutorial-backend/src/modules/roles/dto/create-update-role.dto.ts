import { IsNotEmpty } from "class-validator";

export class CreateUpdateRoleDto{
    @IsNotEmpty()
    name:string

    @IsNotEmpty({message:'There should be one or more premissions selcted'})
    premissions:string[]
}