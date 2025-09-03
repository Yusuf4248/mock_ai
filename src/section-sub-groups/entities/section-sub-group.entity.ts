import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { ListeningQuestionType } from "../../common/enums/enums";
import { Section } from "../../sections/entities/section.entity";

@Entity("section-sub-groups")
export class SectionSubGroup {
  @ApiProperty({
    example: 1,
    description: "Unique ID of the Section Sub Group",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: "The starting number of the question range",
  })
  @Column({ type: "int" })
  question_start: number;

  @ApiProperty({
    example: 10,
    description: "The ending number of the question range",
  })
  @Column({ type: "int" })
  question_end: number;

  @ApiProperty({
    example: "Listening Part 1",
    description: "Subtitle of the section sub group",
  })
  @Column({ type: "varchar" })
  sub_title: string;

  @ApiProperty({
    enum: ListeningQuestionType,
    example: ListeningQuestionType.MULTIPLE_CHOICE,
    description: "Type of listening question in this sub group",
  })
  @Column({ type: "enum", enum: ListeningQuestionType })
  question_type: ListeningQuestionType;

  @ApiProperty({
    type: () => Section,
    description: "The section this sub group belongs to",
  })
  @ManyToOne(() => Section, (section) => section.section_sub_group, {
    onDelete: "CASCADE",
  })
  section: Section;
}
