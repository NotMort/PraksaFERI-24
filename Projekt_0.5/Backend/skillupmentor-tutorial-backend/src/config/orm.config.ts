import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PostgresConnectionCredentialsOptions } from "typeorm/driver/postgres/PostgresConnectionCredentialsOptions";

type ConfigType = TypeOrmModuleOptions & PostgresConnectionCredentialsOptions
type ConnectionOprtions = ConfigType
export const ORMConfig = async ( ConfigService: ConfigService): Promise<ConnectionOprtions> => ({
    type: 'postgres',
    host: ConfigService.get('DATABASE_HOST'),
    port: ConfigService.get('DATABASE_PORT'),
    username: ConfigService.get('DATABASE_USERNAME'),
    password: ConfigService.get('DATABASE_PWD'),
    database: ConfigService.get('DATABASE_NAME'),
    entities: ['dist/**/*.entity.ts'],
    synchronize: true, //dev only
    ssl: true,
    extra:{
        ssl:{
            rejectUnauthorized: false,
        },
    },
})