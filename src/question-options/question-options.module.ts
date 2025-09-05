import { Module } from "@nestjs/common";
import { QuestionOptionsService } from "./question-options.service";
import { QuestionOptionsController } from "./question-options.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionOption } from "./entities/question-option.entity";

@Module({
  imports: [TypeOrmModule.forFeature([QuestionOption])],
  controllers: [QuestionOptionsController],
  providers: [QuestionOptionsService],
})
export class QuestionOptionsModule {}
