import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SubGroupQuestion } from "../../sub-group-questions/entities/sub-group-question.entity";

@Entity("question_blanks")
export class QuestionBlank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  blank_position: number;

  @Column({ type: "varchar", length: 255 })
  correct_answer: string;

  @ManyToOne(() => SubGroupQuestion, (question) => question.question_blanks, {
    onDelete: "CASCADE",
  })
  subGroupQuestion: SubGroupQuestion;
}
