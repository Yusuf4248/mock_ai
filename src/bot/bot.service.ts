import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { OtpService } from "../otp/otp.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Otp } from "../otp/entities/otp.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly otpService: OtpService
  ) {}
  async onStart(ctx: Context) {
    try {
      // is this user already started bot
      const user = await this.otpRepo.findOne({
        where: { telegram_id: ctx.from!.id },
      });
      if (user) {
        await ctx.replyWithHTML(
          `✅ Siz allaqachon aktivatsiyadan o'tgansiz.\n Otp kodni olish /login bosing`
        );
        return;
      }

      await ctx.replyWithHTML(
        `👋 Salom, <b>${ctx.from?.first_name}</b>!\n\n` +
          `📌 <i>"erp-edu.uz"</i> platformasida <b>aktivatsiyadan</b> o'tish uchun ` +
          `<u>kontaktingizni yuboring</u> 👇`,
        {
          ...Markup.keyboard([
            Markup.button.contactRequest("☎️ Kontaktni yuborish"),
          ])
            .oneTime()
            .resize(),
        }
      );
    } catch (error) {
      ctx.reply("Something went wrong. Please try again /start");
      console.log(error);
    }
  }

  async onContact(ctx: Context) {
    try {
      // is user already exist?
      const user = await this.userRepo.findOne({
        where: { telegram_id: ctx.from!.id },
      });

      if (user) {
        await ctx.replyWithHTML(
          `Siz allaqachon ro'yhatdan o'tib bo'lgansiz.\n OTP ni olish uchun /login ni bosing`,
          Markup.removeKeyboard()
        );
      } else {
        const newUser = await this.userRepo.save({
          telegram_id: ctx.from!.id,
          username: ctx.from!.first_name,
        });
        const newOtp = await this.otpService.generateOtp(ctx.from!.id);

        await ctx.replyWithHTML(
          `🔒 Sizning yangi OTP kodingiz: <b>${newOtp.otp}</b>\n` +
            `🔗 Tizimga kirish uchun: <i>erp-edu.uz/login</i>`,
          Markup.inlineKeyboard([
            [Markup.button.callback("🔄 Yangilash", "renew_otp")],
          ])
        );
        return;
      }
    } catch (error) {
      console.error(error);
      await ctx.reply(
        "⚠️ Kutilmagan xatolik yuz berdi. Iltimos, yana urinib ko'ring.",
        Markup.keyboard([Markup.button.contactRequest("☎️ Kontaktni yuborish")])
          .oneTime()
          .resize()
      );
    }
  }

  async onLogin(ctx: Context) {
    const old_otp = await this.otpRepo.findOne({
      where: { telegram_id: ctx.from!.id },
    });
    if (old_otp) {
      const now = new Date();
      if (now < old_otp?.expiration_time) {
        await ctx.replyWithHTML(
          `Eski kodingiz hali ham kuchda ☝️\n 🔒 Code: ${old_otp.otp}`
        );
        return;
      } else {
        await this.otpRepo.delete({ telegram_id: ctx.from!.id });
        const newOtp = await this.otpService.generateOtp(ctx.from!.id);
        await ctx.replyWithHTML(
          `🔒 Sizning yangi OTP kodingiz: <b>${newOtp.otp}</b>\n` +
            `🔗 Tizimga kirish uchun: <i>erp-edu.uz/login</i>`,
          Markup.inlineKeyboard([
            [Markup.button.callback("🔄 Yangilash", "renew_otp")],
          ])
        );
      }
    } else {
      await ctx.reply(
        "⚠️ Siz hali kontaktingizni yubormagansiz.",
        Markup.keyboard([Markup.button.contactRequest("☎️ Kontaktni yuborish")])
          .oneTime()
          .resize()
      );
    }
  }

  async onRenew(ctx: Context) {
    try {
      const oldOtp = await this.otpRepo.findOne({
        where: { telegram_id: ctx.from!.id },
      });

      if (oldOtp) {
        // If it's still valid → notification
        let now = new Date();
        if (now < oldOtp.expiration_time) {
          await ctx.answerCbQuery(
            `⏳ Eski kod hali ham kuchda: ${oldOtp.otp}`,
            {
              show_alert: true,
            }
          );
          return;
        }
      }

      // Old code expired → create a new one
      await this.otpRepo.delete({ telegram_id: ctx.from!.id });
      const newOtp = await this.otpService.generateOtp(ctx.from!.id);

      await ctx.editMessageText(
        `🔒 Sizning yangi OTP kodingiz: <b>${newOtp.otp}</b>\n` +
          `🔗 Tizimga kirish uchun: <i>erp-edu.uz</i>`,
        {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([
            [Markup.button.callback("🔄 Yangilash", "renew_otp")],
          ]),
        }
      );
      await ctx.answerCbQuery("✅ Kod yangilandi!");
    } catch (error) {
      console.error(error);
      await ctx.answerCbQuery("❌ Xatolik yuz berdi.", { show_alert: true });
    }
  }

  async onStop(ctx: Context) {
    await this.otpRepo.delete({ telegram_id: ctx.from!.id });
    await this.userRepo.delete({ telegram_id: ctx.from!.id });
    await ctx.reply("Bot tuxtadi");
  }

  async onText(ctx: Context) {
    try {
      await ctx.replyWithHTML(
        `❌ Noto'g'ri buyruq.\n\n` +
          `ℹ️ Mavjud buyruqlar:\n` +
          `👉 <b>/start</b> – Botni boshlash\n` +
          `👉 <b>/login</b> – Tizimga kirish\n` +
          `👉 <b>/stop</b> – Botni to'xtatish`
      );
    } catch (error) {
      await ctx.reply("error");
    }
  }
}
