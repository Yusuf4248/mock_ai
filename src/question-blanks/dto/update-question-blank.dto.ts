import { PartialType } from '@nestjs/swagger';
import { CreateQuestionBlankDto } from './create-question-blank.dto';

export class UpdateQuestionBlankDto extends PartialType(CreateQuestionBlankDto) {}
