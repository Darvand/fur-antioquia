import { Bot, webhookCallback } from "grammy";
import { Command } from "./telegram-bot.server";
import { Inject, Logger } from "@nestjs/common";
import telegramBotConfig from "./telegram-bot.config";
import { ConfigType } from "@nestjs/config";
import { inspect } from "util";
import { NextFunction, Request, Response } from "express";

export class TelegramBotService {

    private readonly bot: Bot;
    private readonly logger = new Logger(TelegramBotService.name);
    constructor(@Inject(telegramBotConfig.KEY) private readonly config: ConfigType<typeof telegramBotConfig>) {
        this.bot = new Bot(config.token);
    }

    start() {
        this.bot.on('message', async (ctx) => {
            this.logger.debug(`User with id ${ctx.message.from.id} sent a message: ${ctx.message.text}`)
            const isTopicMessage = ctx.message.is_topic_message
            if (isTopicMessage) {
                this.logger.debug("Message from topic", inspect(ctx.message, { depth: 20 }));
                const isAdminTopic = ctx.message.reply_to_message?.forum_topic_created?.name === "Admins"
                if (isAdminTopic || ctx.message.message_thread_id === 2) {
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
        if (process.env.NODE_ENV === "dev") {
            this.bot.start();
        }
        this.logger.log("Bot started")
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

    middleware() {
        return webhookCallback(this.bot, 'express')
    }
}