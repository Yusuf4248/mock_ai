import { PartialType } from '@nestjs/swagger';
import { CreateSubGroupQuestionDto } from './create-sub-group-question.dto';

export class UpdateSubGroupQuestionDto extends PartialType(CreateSubGroupQuestionDto) {}
