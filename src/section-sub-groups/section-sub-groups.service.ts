import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateSectionSubGroupDto } from "./dto/create-section-sub-group.dto";
import { UpdateSectionSubGroupDto } from "./dto/update-section-sub-group.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SectionSubGroup } from "./entities/section-sub-group.entity";
import { Repository } from "typeorm";
import { SectionsService } from "../sections/sections.service";
import { SectionRangeEnum } from "../common/enums/enums";

@Injectable()
export class SectionSubGroupsService {
  constructor(
    @InjectRepository(SectionSubGroup)
    private readonly sectionSubGroupRepo: Repository<SectionSubGroup>,
    private readonly sectionService: SectionsService
  ) {}
  async create(createSectionSubGroupDto: CreateSectionSubGroupDto) {
    const isExist = await this.sectionSubGroupRepo.findOne({
      where: { section: { id: createSectionSubGroupDto.sectionId } },
    });
    if (isExist) {
      throw new BadRequestException(
        `Sub groups for this section already exists`
      );
    }
    const { data: section } = await this.sectionService.findOne(
      createSectionSubGroupDto.sectionId
    );
    console.log(createSectionSubGroupDto.sub_groups[0].question_start);
    console.log(
      createSectionSubGroupDto.sub_groups[
        createSectionSubGroupDto.sub_groups.length - 1
      ].question_end
    );
    if (section.section_range)
      for (let i = 0; i < createSectionSubGroupDto.sub_groups.length - 1; i++) {
        const current = createSectionSubGroupDto.sub_groups[i];
        const next = createSectionSubGroupDto.sub_groups[i + 1];

        if (current.question_end + 1 !== next.question_start) {
          throw new BadRequestException(
            `Invalid question range: subgroup ${i + 1} ends at ${current.question_end}, but subgroup ${i + 2} starts at ${next.question_start}. They must be consecutive.`
          );
        }
      }
    const subGroups = createSectionSubGroupDto.sub_groups.map((sub_group) =>
      this.sectionSubGroupRepo.create({
        question_start: sub_group.question_start,
        question_end: sub_group.question_end,
        sub_title: sub_group.sub_title,
        question_type: sub_group.question_type,
        section,
      })
    );
    const sectionSubGroups = await this.sectionSubGroupRepo.save(subGroups);
    return {
      message: "Section sub groups created",
      data: sectionSubGroups,
    };
  }

  findAll() {
    return `This action returns all sectionSubGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionSubGroup`;
  }

  update(id: number, updateSectionSubGroupDto: UpdateSectionSubGroupDto) {
    return `This action updates a #${id} sectionSubGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionSubGroup`;
  }

  private validateSubGroups(sectionRange: SectionRangeEnum, subGroups: any[]) {
    // section range ni split qilib raqamlarga aylantiramiz
    const [rangeStart, rangeEnd] = sectionRange.split("-").map(Number);

    const firstStart = subGroups[0].question_start;
    const lastEnd = subGroups[subGroups.length - 1].question_end;

    // Tekshirish
    if (firstStart < rangeStart) {
      throw new Error(
        `❌ Birinchi sub-group boshlanishi ${rangeStart} dan kichik bo‘lishi mumkin emas!`
      );
    }

    if (lastEnd > rangeEnd) {
      throw new Error(
        `❌ Oxirgi sub-group oxiri ${rangeEnd} dan katta bo‘lishi mumkin emas!`
      );
    }

    console.log("✅ Sub-group'lar section range ichida joylashgan!");
  }
}
