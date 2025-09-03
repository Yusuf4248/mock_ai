import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SectionEnum, SectionRangeEnum } from "../../common/enums/enums";

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
    example: "Tile",
    description: "Section title",
  })
  @IsString()
  @IsNotEmpty()
  section_title: string;

  @ApiProperty({
    example: SectionRangeEnum.RANGE1,
    description: "Section question range",
    enum: SectionRangeEnum,
  })
  @IsEnum(SectionRangeEnum)
  @IsNotEmpty()
  section_range: SectionRangeEnum;
}
