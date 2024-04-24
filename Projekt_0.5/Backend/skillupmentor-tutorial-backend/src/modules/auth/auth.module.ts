import {Module} from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'modules/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';


@Module({
    imports:[
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: ( configService:ConfigService) =>({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: `${configService.get('JWT_SECRET_EXPIRES')} s`}
            })
        })
    ],
   controllers:[AuthController],
   providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
        },
    ],
    exports: [AuthService]
})
export class AuthModule{

}