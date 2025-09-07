import { Injectable } from '@nestjs/common';
import { CreateQuestionBlankDto } from './dto/create-question-blank.dto';
import { UpdateQuestionBlankDto } from './dto/update-question-blank.dto';

@Injectable()
export class QuestionBlanksService {
  create(createQuestionBlankDto: CreateQuestionBlankDto) {
    return 'This action adds a new questionBlank';
  }

  findAll() {
    return `This action returns all questionBlanks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionBlank`;
  }

  update(id: number, updateQuestionBlankDto: UpdateQuestionBlankDto) {
    return `This action updates a #${id} questionBlank`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionBlank`;
  }
}
