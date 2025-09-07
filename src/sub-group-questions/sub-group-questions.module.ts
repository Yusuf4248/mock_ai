import { Module } from "@nestjs/common";
import { SubGroupQuestionsService } from "./sub-group-questions.service";
import { SubGroupQuestionsController } from "./sub-group-questions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubGroupQuestion } from "./entities/sub-group-question.entity";
import { SectionsModule } from "../sections/sections.module";
import { FileModule } from "../file/file.module";
import { QuestionOption } from "../question-options/entities/question-option.entity";
import { QuestionBlank } from "../question-blanks/entities/question-blank.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubGroupQuestion, QuestionOption, QuestionBlank]),
    SectionsModule,
    FileModule,
  ],
  controllers: [SubGroupQuestionsController],
  providers: [SubGroupQuestionsService],
})
export class SubGroupQuestionsModule {}
