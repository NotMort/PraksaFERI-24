import { Injectable } from "@nestjs/common";
import { PassportStrategy} from "@nestjs/passport";
import { User } from "entities/user.entity";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
 
import { UserService } from "modules/users/users.service";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { TokenPayload } from "interfaces/auth.inerface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(private userService:UserService, configService:ConfigService){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (request:Request)=>{
                    return request?.cookies?.access_token
                },
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }
    async validate(payload:TokenPayload):Promise<User>{
        return  this.userService.findById(payload.sub)
    }
}
