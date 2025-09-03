import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Section } from "./entities/section.entity";
import { Repository } from "typeorm";
import { SectionAudiosService } from "../section-audios/section-audios.service";

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    private readonly sectionAudioService: SectionAudiosService
  ) {}
  async create(createSectionDto: CreateSectionDto, audio: File) {
    const newSection = await this.sectionRepo.save(createSectionDto);
    const { data: newSectionAudio } =
      await this.sectionAudioService.uploadSectionAudio(newSection.id, audio);
    return {
      message: "New section created!",
      data: { newSection, newSectionAudio },
    };
  }

  async findAll(page: number, limit: number, section: any) {
    if (!section) {
      const [sections, total] = await this.sectionRepo.findAndCount({
        relations: [],
        skip: (page - 1) * limit,
        take: limit,
        order: { id: "ASC" },
      });
      return {
        message: "All sections",
        data: sections,
      };
    } else {
      const [sections, total] = await this.sectionRepo.findAndCount({
        where: { section_number: section },
        relations: [],
        skip: (page - 1) * limit,
        take: limit,
        order: { id: "ASC" },
      });
      return {
        message: `All ${section} sections`,
        data: sections,
      };
    }
  }

  async findOne(id: number) {
    const section = await this.sectionRepo.findOne({
      where: { id },
      relations: [],
    });
    if (!section) {
      throw new NotFoundException(`Section with id-${id} not found`);
    }
    return {
      message: `${id} - section`,
      data: section,
    };
  }

  async update(id: number, updateSectionDto: UpdateSectionDto) {
    await this.findOne(id);
    await this.sectionRepo.update(id, updateSectionDto);

    const section = await this.findOne(id);

    return {
      message: "Section data updated",
      data: section,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.sectionRepo.delete(id);

    return {
      message: "Section deleted",
    };
  }
}
