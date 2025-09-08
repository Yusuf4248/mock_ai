import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Section } from "./entities/section.entity";
import { DataSource, Repository } from "typeorm";
import * as path from "path";
import { FileService } from "../file/file.service";
import { CreateSectionSubGroupDto } from "../section-sub-groups/dto/create-section-sub-group.dto";
import { SectionSubGroup } from "../section-sub-groups/entities/section-sub-group.entity";
import { SectionAudio } from "../section-audios/entities/section-audio.entity";
import { SectionEnum, SectionRangeEnum } from "../common/enums/enums";

@Injectable()
export class SectionsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly fileService: FileService,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>
  ) {}

  async create(createSectionDto: CreateSectionDto, audio: File) {
    const queryRunner = this.dataSource.createQueryRunner(); // DataSource dan queryRunner olish

    await queryRunner.connect();
    await queryRunner.startTransaction(); // Tranzaksiyani boshlash

    try {
      // SectionEnum -> SectionRangeEnum mapping qilish
      const sectionRangeMap: Record<SectionEnum, SectionRangeEnum> = {
        [SectionEnum.PART_ONE]: SectionRangeEnum.RANGE1,
        [SectionEnum.PART_TWO]: SectionRangeEnum.RANGE2,
        [SectionEnum.PART_THREE]: SectionRangeEnum.RANGE3,
        [SectionEnum.PART_FOUR]: SectionRangeEnum.RANGE4,
      };

      const sectionRange = sectionRangeMap[createSectionDto.section_number];
      if (!sectionRange) {
        throw new BadRequestException("Invalid section part!");
      }
      // 1. Section saqlash
      const newSection = await queryRunner.manager.save(
        Section,
        createSectionDto
      );
      if (!newSection) {
        throw new BadRequestException(
          "Can not create section. Please try again"
        );
      }

      // 2. Audio yuklash va saqlash
      const filePath = path.resolve(__dirname, "../..", "uploads", "audios");
      const fileName = await this.fileService.uploadAudio(audio, filePath);
      if (fileName && typeof fileName === "object" && "message" in fileName) {
        throw new BadRequestException(
          fileName.message || "File saqlashda xatolik yuz berdi"
        );
      }
      const newSectionAudio = await queryRunner.manager.save(SectionAudio, {
        file_path: `http://localhost:3000/audios/${fileName}`,
        section: newSection,
      });

      // 3. Section sub-groups tekshirish va saqlash
      const createSectionSubGroupDto: CreateSectionSubGroupDto = {
        sectionId: newSection.id,
        sub_groups: createSectionDto.sub_groups,
      };

      const isExist = await queryRunner.manager.findOne(SectionSubGroup, {
        where: { section: { id: createSectionSubGroupDto.sectionId } },
      });
      if (isExist) {
        throw new BadRequestException(
          `Sub groups for this section already exists`
        );
      }

      const section = await queryRunner.manager.findOne(Section, {
        where: { id: createSectionSubGroupDto.sectionId },
      });
      if (section?.section_range) {
        for (
          let i = 0;
          i < createSectionSubGroupDto.sub_groups.length - 1;
          i++
        ) {
          const current = createSectionSubGroupDto.sub_groups[i];
          const next = createSectionSubGroupDto.sub_groups[i + 1];
          if (current.question_end + 1 !== next.question_start) {
            throw new BadRequestException(
              `Invalid question range: subgroup ${i + 1} ends at ${current.question_end}, but subgroup ${i + 2} starts at ${next.question_start}. They must be consecutive.`
            );
          }
        }
      }

      const subGroups = createSectionSubGroupDto.sub_groups.map((sub_group) =>
        queryRunner.manager.create(SectionSubGroup, {
          question_start: sub_group.question_start,
          question_end: sub_group.question_end,
          sub_title: sub_group.sub_title,
          question_type: sub_group.question_type,
          section: newSection,
        })
      );
      const sectionSubGroups = await queryRunner.manager.save(
        SectionSubGroup,
        subGroups
      );

      await queryRunner.commitTransaction(); // Hammasi muvaffaqiyatli bo'lsa, tranzaksiyani commit qilish

      return {
        message: "New section created!",
        data: { newSection, newSectionAudio, sectionSubGroups },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Xatolik bo'lsa, hamma o'zgarishlarni qaytarish
      console.error("Xatolik yuz berdi:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Section yaratishda xatolik yuz berdi"
      );
    } finally {
      await queryRunner.release(); // Har doim QueryRunner ni ozod qilish
    }
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
      relations: ["section_sub_group", "question"],
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
