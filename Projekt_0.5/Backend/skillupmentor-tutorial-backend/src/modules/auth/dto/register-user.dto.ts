import { IsEmail, IsNotEmpty, IsOptional, Matches} from "class-validator";
import { Match } from "decorators/match.decorators";

export class RegisterUserDto{
    @IsOptional()
    first_name?: string;

    @IsOptional()
    last_name?: string;

    @IsNotEmpty()
    @IsEmail() 
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Incorrect password format'
    })
    password: string;
    
    @IsNotEmpty()
    @Match(RegisterUserDto, (field) => field.password,{message: 'Passwords are not the same'})
    confirm_password:string;
}