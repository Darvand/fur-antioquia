import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { Context } from "grammy";
import { TelegramBotService } from "./telegram-bot.service";
import { ElectionsService } from "src/elections/elections.service";

@Controller()
export class TelegramBotController {

    constructor(private readonly bot: TelegramBotService, private readonly elections: ElectionsService) { }

    @EventPattern({
        command: 'admins',
        description: 'Obtiene la lista de administradores del chat'
    })
    async getAdmins(ctx: Context) {
        const admins = await this.bot.getAdmins();
        console.log("Administradores: ", admins);
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
        const results = await this.elections.getHTMLResults();
        return ctx.reply(results, { parse_mode: "HTML" });
    }
}