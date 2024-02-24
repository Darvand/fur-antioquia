import { Controller, Logger } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { Context } from "grammy";
import { TelegramBotService } from "./telegram-bot.service";
import { ElectionsService } from "src/elections/elections.service";

@Controller()
export class TelegramBotController {
    private readonly logger = new Logger(TelegramBotController.name)

    constructor(private readonly bot: TelegramBotService, private readonly elections: ElectionsService) { }

    @EventPattern({
        command: 'admins',
        description: 'Obtiene la lista de administradores del chat'
    })
    async getAdmins(ctx: Context) {
        const admins = await this.bot.getAdmins();
        this.logger.debug(`Found ${admins.length} admins`);
        const listHtml = admins.map((admin) => {
            return `<b>${admin.user.first_name}</b>`;
        });
        return ctx.reply(`Administradores: ${listHtml.join(", ")}`, { parse_mode: "HTML" });
    }

    @EventPattern({
        command: 'resultados',
        description: 'Resultados de las votaciones'
    })
    async getResults(ctx: Context) {
        this.logger.debug("Getting election results");
        const results = await this.elections.getHTMLResults();
        return ctx.reply(results, { parse_mode: "HTML" });
    }
}