import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: 12345678,
    description: "otp code",
  })
  @IsNumber()
  @IsNotEmpty()
  otp_code: number;
}
