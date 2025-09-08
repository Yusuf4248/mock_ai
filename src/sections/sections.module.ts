import { forwardRef, Module } from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { SectionsController } from "./sections.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Section } from "./entities/section.entity";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Section]),
    FileModule,
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
