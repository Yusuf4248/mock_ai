import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubGroupQuestion } from "../../sub-group-questions/entities/sub-group-question.entity";

@Entity("answers")
export class Answer {
  @ApiProperty({
    example: 1,
    description: "Unique ID of the answer",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "B) 5",
    description: "The correct answer for the sub-group question",
    type: String,
  })
  @Column({ type: "varchar" })
  correct_answer: string;

  @ApiProperty({
    example: true,
    description: "Indicates whether this answer is correct",
    default: false,
    type: Boolean,
  })
  @Column({ type: "boolean", default: false })
  is_correct: boolean;

  @ApiProperty({
    type: () => SubGroupQuestion,
    description: "The sub-group question this answer belongs to",
    required: false,
  })
  @ManyToOne(
    () => SubGroupQuestion,
    (subGroupQuestion) => subGroupQuestion.answers,
    {
      nullable: true,
      onDelete: "CASCADE",
    }
  )
  subGroupQuestion: SubGroupQuestion;
}
