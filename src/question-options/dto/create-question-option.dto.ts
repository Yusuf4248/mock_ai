import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateQuestionOptionDto {
  @ApiProperty({
    example: "A: Something",
    description: "Text of the option (e.g., A: Paris)",
  })
  @IsString()
  @IsNotEmpty()
  option_text: string;

  @ApiProperty({
    example: false,
    description: "Indicates if this option is the correct answer",
  })
  @IsBoolean()
  @IsOptional()
  is_correct?: boolean;
}
