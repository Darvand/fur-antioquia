import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TelegramBotController } from "./telegram-bot.controller";
import { TelegramBotService } from "./telegram-bot.service";
import { ElectionsModule } from "src/elections/elections.module";
import { webhookCallback } from "grammy";

@Module({
    imports: [ElectionsModule],
    controllers: [TelegramBotController],
    providers: [TelegramBotService]

})
export class TelegramBotModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(webhookCallback);
    }
}