import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Otp } from "../otp/entities/otp.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async generateTokens(user: User) {
    const payload = {
      id: user.id,
      role: user.role,
      is_creator: user.is_creator,
      telegram_id: user.telegram_id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logIn(loginDto: LoginDto, res: Response) {
    const otp = await this.otpRepo.findOne({
      where: { otp: loginDto.otp_code },
    });
    if (!otp) {
      throw new NotFoundException("Invalid OTP. Please check and try again");
    }
    const current_date = new Date();
    if (current_date > otp.expiration_time) {
      await this.otpRepo.delete({ otp: loginDto.otp_code });
      throw new BadRequestException("Your OTP code expired");
    }
    if (otp.verified) {
      throw new BadRequestException("This OTP already used");
    }
    await this.otpRepo.update({ otp: loginDto.otp_code }, { verified: true });

    const user = await this.userRepo.findOne({
      where: { telegram_id: otp.telegram_id },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user!);

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_REFRESH_TIME),
      httpOnly: true,
    });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 7);
    await this.userService.updateTokenHash(user!.id, refreshTokenHash);

    return { message: "Successfully logged in", access_token: accessToken };
  }

  async logOut(req: Request, res: Response) {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new UnauthorizedException("Refresh token not found. Please log in");
    }

    const decoded_token = await this.jwtService.verify(refresh_token, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    const admin = await this.userService.findByTelegramId(
      decoded_token.telegram_id
    );
    if (!admin) {
      throw new BadRequestException("Something went wrong");
    }
    await this.userService.updateTokenHash(admin.id, "");
    res.clearCookie("refresh_token");

    return {
      success: true,
      message: "Signed out successfully",
    };
  }

  async refreshTokens(req: Request, res: Response) {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new UnauthorizedException("Refresh token not found. Please log in");
    }
    const decoded_token = await this.jwtService.verify(refresh_token, {
      secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
    });
    const admin = await this.userService.findByTelegramId(
      decoded_token.telegram_id
    );
    if (!admin) {
      throw new BadRequestException("Something went wrong");
    }

    const { accessToken, refreshToken } = await this.generateTokens(admin);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 7);
    await this.userService.updateTokenHash(admin.id, refreshTokenHash);

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_REFRESH_TIME),
      httpOnly: true,
    });

    return {
      success: true,
      message: "Tokens updated!",
      access_token: accessToken,
    };
  }
}
