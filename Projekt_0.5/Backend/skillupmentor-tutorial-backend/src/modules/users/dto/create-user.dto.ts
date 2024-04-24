import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEmail, Matches } from "class-validator";
import { Match } from "decorators/match.decorators";

export class CreateUserDto {
    @ApiProperty({required:false})
    @IsOptional()
    first_name?: string;
    @ApiProperty({required:false})
    @IsOptional()
    last_name?: string;
    @ApiProperty({required:true})
    @IsNotEmpty() 
    @IsEmail() 
    email: string;
    @ApiProperty({required:true})
    @IsNotEmpty() 
    role_id: string;
    @ApiProperty({required:true})
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Incorrect password format'
    })
    password: string;
    @ApiProperty({required:true})
    @IsNotEmpty()
    @Match(CreateUserDto, (field) => field.password,{message: 'Passwords are not the same'})
    confirm_password:string;
}