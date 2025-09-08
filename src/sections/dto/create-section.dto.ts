import { IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { SectionEnum, SectionRangeEnum } from "../../common/enums/enums";
import { CreateSectionSubGroupItemDto } from "../../section-sub-groups/dto/create-section-sub-group.dto";

export class CreateSectionDto {
  @ApiProperty({
    example: SectionEnum.PART_ONE,
    description: "Shows which part of listening is this",
    enum: SectionEnum,
  })
  @IsEnum(SectionEnum)
  @IsNotEmpty()
  section_number: SectionEnum;

  @ApiProperty({
    example: "Listening Section",
    description: "Section title",
  })
  @IsString()
  @IsNotEmpty()
  section_title: string;

  @ApiProperty({
    description:
      "Array of sub-groups inside this section (JSON string in Swagger)",
    example: JSON.stringify([
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
    ]),
  })
  @IsOptional()
  // @ValidateNested({ each: true })
  // @Type(() => CreateSectionSubGroupItemDto)
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
  sub_groups: CreateSectionSubGroupItemDto[];
}
