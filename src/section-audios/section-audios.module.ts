import { forwardRef, Module } from "@nestjs/common";
import { SectionAudiosService } from "./section-audios.service";
import { SectionAudiosController } from "./section-audios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionAudio } from "./entities/section-audio.entity";
import { SectionsModule } from "../sections/sections.module";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SectionAudio]),
    forwardRef(() => SectionsModule),
    FileModule,
  ],
  controllers: [SectionAudiosController],
  providers: [SectionAudiosService],
  exports: [SectionAudiosService],
})
export class SectionAudiosModule {}
