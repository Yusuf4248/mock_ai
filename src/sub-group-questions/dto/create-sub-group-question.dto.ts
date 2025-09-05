import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { ListeningQuestionType } from "../../common/enums/enums";
import { Transform, Type } from "class-transformer"; // Create a nested DTO for question_options
import { CreateQuestionOptionDto } from "../../question-options/dto/create-question-option.dto";

export class CreateSubGroupQuestionDto {
  @ApiProperty({
    enum: ListeningQuestionType,
    example: ListeningQuestionType.MULTIPLE_CHOICE,
    description: "Type of listening question in this sub group",
    required: true,
  })
  @IsEnum(ListeningQuestionType)
  @IsNotEmpty()
  question_type: ListeningQuestionType;

  @ApiProperty({
    example: 5,
    description: "Number of the question (1–40)",
    minimum: 1,
    maximum: 40,
    required: true,
  })
  @IsInt()
  @Min(1)
  @Max(40)
  @IsNotEmpty()
  @Type(() => Number)
  question_number: number;

  @ApiProperty({
    example: "What is the capital of France?",
    description: "The text of the question",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({
    example: "Paris",
    description: "Correct answer for question",
    required: false,
  })
  @IsString()
  answer: string;

  @ApiProperty({
    example: "https://example.com/photo.jpg",
    description: "Optional photo related to the question (path after upload)",
    required: false,
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({
    example: 1,
    description: "ID of the section this question belongs to",
    required: false,
  })
  @IsInt()
  @Type(() => Number)
  sectionId: number;

  @ApiProperty({
    example: [
      { option_text: "A: Paris", is_correct: true },
      { option_text: "B: London", is_correct: false },
    ],
    description: "Array of question options for multiple-choice questions",
    required: false,
  })
  // @IsArray()
  @IsOptional()
  // @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed; // to'g'ridan-to'g'ri massiv qaytaradi
        }

        if (parsed && typeof parsed === "object") {
          return [parsed]; // bitta object bo'lsa arrayga o'rab beradi
        }

        return [];
      } catch (error) {
        console.error("Failed to parse sub_groups string:", error);
        return [];
      }
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === "object") {
      return [value];
    }

    return [];
  })
  question_options?: CreateQuestionOptionDto[];
}
