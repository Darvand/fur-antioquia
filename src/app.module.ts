import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';
import { ConfigModule } from '@nestjs/config';
import telegramBotConfig from './telegram-bot/telegram-bot.config';
import databaseConfig from './database/database.config';
import { DatabaseModule } from './database/database.module';
import { TelegramBotMiddleware } from './telegram-bot/telegram-bot.middleware';

@Module({
  imports: [
    DatabaseModule,
    TelegramBotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [telegramBotConfig, databaseConfig]
    })],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TelegramBotMiddleware).forRoutes('*');
  }
}