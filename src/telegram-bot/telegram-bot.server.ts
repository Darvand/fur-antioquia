import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import { TelegramBotService } from "./telegram-bot.service";

export type Command = {
    command: string;
    description: string;
}

export class TelegramBotServer extends Server implements CustomTransportStrategy {

    constructor(private readonly bot: TelegramBotService) {
        super();
    }

    async listen(callback: () => void) {
        await this.start(callback);
    }

    async start(callback: () => void) {
        await this.bindHandlers();
        this.bot.start();
        callback();
    }

    async bindHandlers(): Promise<void> {
        this.messageHandlers.forEach((handler, command) => {
            this.logger.log(`Registring command: ${command}`);
            const pattern = JSON.parse(command).command
            this.bot.command(pattern, handler);
        })
        this.bot.setCommands(Array.from(this.messageHandlers.keys()).map<Command>(command => JSON.parse(command)));

    }

    close() {
        console.log("Cerrando servidor de Telegram");
        this.bot.stop();
    }
}