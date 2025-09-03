import { Module } from "@nestjs/common";
import { SectionSubGroupsService } from "./section-sub-groups.service";
import { SectionSubGroupsController } from "./section-sub-groups.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionSubGroup } from "./entities/section-sub-group.entity";
import { SectionsModule } from "../sections/sections.module";

@Module({
  imports: [TypeOrmModule.forFeature([SectionSubGroup]), SectionsModule],
  controllers: [SectionSubGroupsController],
  providers: [SectionSubGroupsService],
  exports: [SectionSubGroupsService],
})
export class SectionSubGroupsModule {}
