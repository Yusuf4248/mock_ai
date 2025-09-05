import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SectionEnum, SectionRangeEnum } from "../../common/enums/enums";
import { SectionAudio } from "../../section-audios/entities/section-audio.entity";
import { SectionSubGroup } from "../../section-sub-groups/entities/section-sub-group.entity";
import { SubGroupQuestion } from "../../sub-group-questions/entities/sub-group-question.entity";

@Entity("sections")
export class Section {
  @ApiProperty({
    example: 1,
    description: "Section unique ID",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: SectionEnum.PART_ONE,
    description: "Shows which part of listening is this",
    enum: SectionEnum,
  })
  @Column({ type: "enum", enum: SectionEnum })
  section_number: SectionEnum;

  @ApiProperty({
    example: "Tile",
    description: "Section title",
  })
  @Column({ type: "varchar" })
  section_title: string;

  @ApiProperty({
    example: SectionRangeEnum.RANGE1,
    description: "",
    enum: SectionRangeEnum,
  })
  @Column({ type: "enum", enum: SectionRangeEnum })
  section_range: SectionRangeEnum;

  @OneToOne(() => SectionAudio, (audio) => audio.section)
  audio: SectionAudio;

  @OneToMany(
    () => SectionSubGroup,
    (section_sub_group) => section_sub_group.section,
    { nullable: true, onDelete: "CASCADE" }
  )
  section_sub_group: SectionSubGroup[];

  @OneToMany(() => SubGroupQuestion, (question) => question.section, {
    nullable: true,
    onDelete: "CASCADE",
  })
  question: SubGroupQuestion[];
}
