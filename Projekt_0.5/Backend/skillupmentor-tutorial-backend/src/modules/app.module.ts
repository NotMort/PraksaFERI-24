import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from 'config/schema.config';
 import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from 'middleware/logger.middleware';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './roles/role.module';
import { PremissionModule } from './permissions/premissions.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { PremissionGuard } from './permissions/guards/premission.guard';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/orders.module';
@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`.env.${process.env.STAGE}`],
    validationSchema: configValidationSchema
  }),
  DatabaseModule,
  UserModule,
  AuthModule,
  RoleModule,
  PremissionModule,
  ProductModule,
  OrderModule,
],
  
  controllers: [],
  providers: [
    {provide: APP_GUARD,
      useClass:JwtAuthGuard,
    },{provide: APP_GUARD,
      useClass:PremissionGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({path:'*',method: RequestMethod.ALL})
  }
}
