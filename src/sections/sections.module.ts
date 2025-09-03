import { forwardRef, Module } from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { SectionsController } from "./sections.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Section } from "./entities/section.entity";
import { SectionAudiosModule } from "../section-audios/section-audios.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Section]),
    forwardRef(() => SectionAudiosModule),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
