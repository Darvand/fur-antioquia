import { Module } from "@nestjs/common";
import { TelegramBotController } from "./telegram-bot.controller";
import { TelegramBotService } from "./telegram-bot.service";
import { ElectionsModule } from "src/elections/elections.module";

@Module({
    imports: [ElectionsModule],
    controllers: [TelegramBotController],
    providers: [TelegramBotService]

})
export class TelegramBotModule { }