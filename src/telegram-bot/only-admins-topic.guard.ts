import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Context } from 'grammy';
import { Observable } from 'rxjs';
import { TelegramBotService } from './telegram-bot.service';
import telegramBotConfig from './telegram-bot.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class OnlyAdminsTopicGuard implements CanActivate {
  private readonly logger = new Logger(OnlyAdminsTopicGuard.name);
  constructor(
    private readonly bot: TelegramBotService,
    @Inject(telegramBotConfig.KEY)
    private readonly config: ConfigType<typeof telegramBotConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getData() as Context;
    if (request.message?.message_thread_id === this.config.adminsTopicId) {
      const admins = await this.bot.getAdmins();
      const isAdmin = admins.some((admin) => admin.user.id === request.from.id);
      if (!isAdmin) {
        this.logger.debug(`User ${request.from.id} is not an admin`);
        await request.deleteMessage();
        return false;
      }
      this.logger.debug(`User ${request.from.id} is an admin`);
    }
    return true;
  }
}
