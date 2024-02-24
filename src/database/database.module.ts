import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import databaseConfig from "./database.config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (config: ConfigType<typeof databaseConfig>) => {
                Logger.log(`Connecting to database: ${`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/?retryWrites=true&w=majority&appName=hogar-dev`}`)
                return {
                    uri: `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/retryWrites=true&w=majority&appName=hogar-dev`,
                    dbName: config.dbName,
                }
            },
            inject: [databaseConfig.KEY],
            imports: [ConfigModule]
        })
    ]
})
export class DatabaseModule { }