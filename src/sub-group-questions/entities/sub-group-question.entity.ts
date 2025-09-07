import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Section } from "../../sections/entities/section.entity";
import { ListeningQuestionType } from "../../common/enums/enums";
import { Answer } from "../../answers/entities/answer.entity";
import { QuestionOption } from "../../question-options/entities/question-option.entity";
import { QuestionBlank } from "../../question-blanks/entities/question-blank.entity";

@Entity("sub-group-questions")
export class SubGroupQuestion {
  @ApiProperty({
    example: 1,
    description: "Unique ID of the sub group question",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: ListeningQuestionType,
    example: ListeningQuestionType.MULTIPLE_CHOICE,
    description: "Type of listening question in this sub group",
  })
  @Column({ type: "enum", enum: ListeningQuestionType })
  question_type: ListeningQuestionType;

  @ApiProperty({
    example: 5,
    description: "Number of the question (1–40)",
  })
  @Column({ type: "int" })
  question_number: number;

  @ApiProperty({
    example: "What is the capital of France?",
    description: "The text of the question",
  })
  @Column({ type: "text" })
  question_text: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ApiProperty({
    example: "Paris",
    description: "Correct answer for question",
  })
  @Column({ type: "varchar", nullable: true })
  answer: string;

  @ApiProperty({
    example: "https://example.com/photo.jpg",
    description: "Optional photo related to the question",
    required: false,
  })
  @Column({ type: "varchar", nullable: true })
  photo: string;

  @ApiProperty({
    type: () => Section,
    description: "The section this question belongs to",
    required: false,
  })
  @ManyToOne(() => Section, (section) => section.question, {
    nullable: true,
    onDelete: "CASCADE",
  })
  section: Section;

  @OneToMany(() => Answer, (answer) => answer.subGroupQuestion, {
    nullable: true,
    onDelete: "CASCADE",
  })
  answers: Answer[];

  @OneToMany(
    () => QuestionOption,
    (question_option) => question_option.subGroupQuestion,
    {
      nullable: true,
      onDelete: "CASCADE",
    }
  )
  question_option: QuestionOption[];

  @OneToMany(() => QuestionBlank, (blank) => blank.subGroupQuestion, {
    cascade: true,
  })
  question_blanks: QuestionBlank[];
}
