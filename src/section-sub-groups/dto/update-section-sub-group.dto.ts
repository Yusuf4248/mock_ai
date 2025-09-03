import { PartialType } from '@nestjs/swagger';
import { CreateSectionSubGroupDto } from './create-section-sub-group.dto';

export class UpdateSectionSubGroupDto extends PartialType(CreateSectionSubGroupDto) {}
