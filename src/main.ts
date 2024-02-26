import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotServer } from './telegram-bot/telegram-bot.server';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import telegramBotConfig from './telegram-bot/telegram-bot.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(TelegramBotService);
  const config = app.get(telegramBotConfig.KEY);
  app.connectMicroservice(
    { strategy: new TelegramBotServer(bot, config) },
    { inheritAppConfig: true },
  );
  await app.listen(3000);
  await app.startAllMicroservices();
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
