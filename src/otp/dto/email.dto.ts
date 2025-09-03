import { IsEmail } from "class-validator";

export class LidEmailDto {
  @IsEmail()
  email: string;
}
