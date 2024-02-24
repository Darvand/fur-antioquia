import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import databaseConfig from "./database.config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (config: ConfigType<typeof databaseConfig>) => ({
                uri: `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/retryWrites=true&w=majority`,
                dbName: config.dbName,
            }),
            inject: [databaseConfig.KEY],
            imports: [ConfigModule]
        })
    ]
})
export class DatabaseModule { }