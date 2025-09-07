import { Module } from "@nestjs/common";
import { QuestionBlanksService } from "./question-blanks.service";
import { QuestionBlanksController } from "./question-blanks.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionBlank } from "./entities/question-blank.entity";

@Module({
  imports: [TypeOrmModule.forFeature([QuestionBlank])],
  controllers: [QuestionBlanksController],
  providers: [QuestionBlanksService],
})
export class QuestionBlanksModule {}
