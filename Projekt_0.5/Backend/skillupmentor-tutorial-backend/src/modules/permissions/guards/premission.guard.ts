import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "entities/role.entity";
import { User } from "entities/user.entity";
import { AuthService } from "modules/auth/auth.service";
import { RoleService } from "modules/roles/role.service";
import { UserService } from "modules/users/users.service";
import { Observable } from "rxjs";

@Injectable()
export class PremissionGuard implements CanActivate{
    constructor(
        private reflector:Reflector,
        private authService: AuthService,
        private userService: UserService,
        private roleService:RoleService
    ){}
    async canActivate(context: ExecutionContext):  Promise<boolean>  {
        const access = this.reflector.get('access', context.getHandler())
        if(!access) return true
        const request = context.switchToHttp().getRequest()
        const userId=await this.authService.getUserId(request)
        const user:User = await this.userService.findById(userId,['role'])
        const role:Role = await this.roleService.findById(user.role.id,['premissions'])
        if (request.method === 'GET'){
            return role.premissions.some((p)=> p.name ===`view_${access}` || p.name ===`edit_${access}`)
        }
        return role.premissions.some((p)=> p.name ===`edit_${access}`)
    }
}
