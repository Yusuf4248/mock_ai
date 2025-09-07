import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionBlanksService } from './question-blanks.service';
import { CreateQuestionBlankDto } from './dto/create-question-blank.dto';
import { UpdateQuestionBlankDto } from './dto/update-question-blank.dto';

@Controller('question-blanks')
export class QuestionBlanksController {
  constructor(private readonly questionBlanksService: QuestionBlanksService) {}

  @Post()
  create(@Body() createQuestionBlankDto: CreateQuestionBlankDto) {
    return this.questionBlanksService.create(createQuestionBlankDto);
  }

  @Get()
  findAll() {
    return this.questionBlanksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBlanksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionBlankDto: UpdateQuestionBlankDto) {
    return this.questionBlanksService.update(+id, updateQuestionBlankDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionBlanksService.remove(+id);
  }
}
