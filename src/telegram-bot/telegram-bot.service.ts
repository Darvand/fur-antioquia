import { Bot } from "grammy";
import { Command } from "./telegram-bot.server";
import { Inject, Logger } from "@nestjs/common";
import telegramBotConfig from "./telegram-bot.config";
import { ConfigType } from "@nestjs/config";
import { inspect } from "util";

export class TelegramBotService {

    private readonly bot: Bot;
    private readonly logger = new Logger(TelegramBotService.name);
    constructor(@Inject(telegramBotConfig.KEY) private readonly config: ConfigType<typeof telegramBotConfig>) {
        this.bot = new Bot(config.token);
    }

    start() {
        this.bot.on('message', async (ctx) => {
            const isTopicMessage = ctx.message.is_topic_message
            if (isTopicMessage) {
                const isAdminTopic = ctx.message.reply_to_message.forum_topic_created.name === "Admins"
                if (isAdminTopic) {
                    // const isMemberAdmin = ctx.message.from
                    // console.log("Mensaje recibido: ", inspect(ctx, { depth: 10 }));
                    const member = await ctx.api.getChatMember(this.config.chatId, ctx.message.from.id);
                    if (member.status !== "administrator" && member.status !== "creator") {

                        await ctx.deleteMessage();
                    }
                }
            }

        });
        this.bot.catch((err) => {
            this.logger.error("Bot Error: ", err);
        });
        this.bot.start();
    }

    command(pattern: string, handler: (ctx: any) => void) {
        this.bot.command(pattern, handler);
    }

    stop() {
        this.bot.stop();
    }

    getAdmins() {
        return this.bot.api.getChatAdministrators(this.config.chatId);
    }

    setCommands(commands: Command[]) {
        this.bot.api.setMyCommands(commands)
    }
}