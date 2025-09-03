import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class VerifyOtpDto {
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  verification_key?: string;
}
