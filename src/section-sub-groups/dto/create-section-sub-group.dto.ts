import {
  IsInt,
  IsArray,
  ValidateNested,
  IsString,
  IsEnum,
  Min,
  Max,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ListeningQuestionType } from "../../common/enums/enums";

export class CreateSectionSubGroupItemDto {
  @ApiProperty({
    example: 1,
    description: "The starting number of the question range (e.g., 1)",
  })
  @IsInt()
  @Min(1)
  @Max(40)
  question_start: number;

  @ApiProperty({
    example: 10,
    description: "The ending number of the question range (e.g., 10)",
  })
  @IsInt()
  @Min(1)
  @Max(40)
  question_end: number;

  @ApiProperty({
    example: "Listening Part 1",
    description: "Subtitle or label of the section sub-group",
  })
  @IsString()
  sub_title: string;

  @ApiProperty({
    example: ListeningQuestionType.MULTIPLE_CHOICE,
    enum: ListeningQuestionType,
    description: "Type of listening question (must be one of the enum values)",
  })
  @IsEnum(ListeningQuestionType)
  question_type: ListeningQuestionType;
}

export class CreateSectionSubGroupDto {
  @ApiProperty({
    example: 1,
    description: "The ID of the parent Section (foreign key)",
  })
  @IsInt()
  @IsOptional()
  sectionId: number;

  @ApiProperty({
    type: [CreateSectionSubGroupItemDto],
    description: "Array of sub-group items belonging to this section",
    example: [
      {
        question_start: 1,
        question_end: 10,
        sub_title: "Listening Part 1",
        question_type: "MULTIPLE_CHOICE",
      },
      {
        question_start: 11,
        question_end: 20,
        sub_title: "Listening Part 2",
        question_type: "FILL_IN_THE_BLANK",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionSubGroupItemDto)
  sub_groups: CreateSectionSubGroupItemDto[];
}
