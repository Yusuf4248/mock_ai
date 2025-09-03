import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { UserRole } from "../../common/enums/enums";

export class CreateUserDto {
  @ApiProperty({
    example: "John",
    description: "User's username",
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
