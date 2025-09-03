import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { OtpModule } from "../otp/otp.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Otp } from "../otp/entities/otp.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User]), OtpModule],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
