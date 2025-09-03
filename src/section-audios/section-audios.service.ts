import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SectionAudio } from "./entities/section-audio.entity";
import { Repository } from "typeorm";
import { SectionsService } from "../sections/sections.service";
import { FileService } from "../file/file.service";
import * as path from "path";

@Injectable()
export class SectionAudiosService {
  constructor(
    @InjectRepository(SectionAudio)
    private readonly sectionAudioRepo: Repository<SectionAudio>,
    @Inject(forwardRef(() => SectionsService))
    private readonly sectionsService: SectionsService,
    private readonly fileService: FileService
  ) {}

  async uploadSectionAudio(id: number, audio: File) {
    const { data: section } = await this.sectionsService.findOne(id);
    const filePath = path.resolve(__dirname, "../..", "uploads", "audios");

    const fileName = await this.fileService.uploadAudio(audio, filePath);
    const newSectionAudio = await this.sectionAudioRepo.save({
      file_path: `http://localhost:3000/uploads/audio/${fileName}`,
      section,
    });

    return {
      message: "Section audio uploaded",
      data: newSectionAudio,
    };
  }
}
