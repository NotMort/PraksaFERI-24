import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEmail, Matches, ValidateIf } from "class-validator";
import { Match } from "decorators/match.decorators";

export class UpdateUserDto {
    @ApiProperty({required:false})
    @IsOptional()
    first_name?: string;
    @ApiProperty({required:false})
    @IsOptional()
    last_name?: string;
    @ApiProperty({required:false})
    @IsOptional() 
    @IsEmail() 
    email?: string;

 
    @ApiProperty({required:false})
    @IsOptional()
    role_id?: string;
    @ApiProperty({required:false})
    @IsOptional()
    avatar?: string;
    @ApiProperty({required:false})
    @ValidateIf((o)=> typeof o.password ==='string'&& o.password.length>0 )
    @IsOptional()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Incorrect password format'
    })
    password?: string;
    @ApiProperty({required:false})
    @ValidateIf((o)=> typeof o.password ==='string'&& o.password.length>0 )
    @IsOptional()
    @Match(UpdateUserDto, (field) => field.password,{message: 'Passwords are not the same'})
    confirm_password?:string;
}