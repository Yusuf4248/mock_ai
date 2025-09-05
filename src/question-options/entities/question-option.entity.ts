import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubGroupQuestion } from "../../sub-group-questions/entities/sub-group-question.entity";

@Entity("question-options")
export class QuestionOption {
  @ApiProperty({
    example: 1,
    description: "Unique ID of the question option",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "A) 3",
    description:
      "The text of the option for the question (e.g., choice or label)",
    type: String,
  })
  @Column({ type: "varchar" })
  option_text: string;

  @ApiProperty({
    example: false,
    description: "Indicates whether this option is the correct answer",
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
    (subGroupQuestion) => subGroupQuestion.question_option,
    {
      nullable: true,
      onDelete: "CASCADE",
    }
  )
  subGroupQuestion: SubGroupQuestion;
}
