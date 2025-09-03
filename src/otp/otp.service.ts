import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Otp } from "./entities/otp.entity";
import { Repository } from "typeorm";
import * as otpGenerator from "otp-generator";
import * as uuid from "uuid";
import { AddMinutesToDate } from "../common/helpers/add-minute";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>
  ) {}

  async generateOtp(telegram_id: number) {
    const otp = otpGenerator.generate(8, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 1);

    const newOtp = await this.otpRepo.save({
      id: uuid.v4(),
      telegram_id,
      otp,
      expiration_time,
    });
    return newOtp;
  }
}
