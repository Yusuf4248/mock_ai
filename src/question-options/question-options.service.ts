import { Injectable } from '@nestjs/common';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { UpdateQuestionOptionDto } from './dto/update-question-option.dto';

@Injectable()
export class QuestionOptionsService {
  create(createQuestionOptionDto: CreateQuestionOptionDto) {
    return 'This action adds a new questionOption';
  }

  findAll() {
    return `This action returns all questionOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionOption`;
  }

  update(id: number, updateQuestionOptionDto: UpdateQuestionOptionDto) {
    return `This action updates a #${id} questionOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionOption`;
  }
}
