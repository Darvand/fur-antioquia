import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotServer } from './telegram-bot/telegram-bot.server';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(TelegramBotService);
  app.connectMicroservice({ strategy: new TelegramBotServer(bot) })
  await app.listen(3000);
  await app.startAllMicroservices();
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
