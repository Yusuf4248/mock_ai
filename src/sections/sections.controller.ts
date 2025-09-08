import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from "@nestjs/swagger";
import {
  ListeningQuestionType,
  SectionEnum,
  SectionRangeEnum,
} from "../common/enums/enums";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Sections")
@Controller("sections")
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("audio"))
  @ApiOperation({ summary: "Create a new section with audio" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "Section successfully created.",
    type: CreateSectionDto,
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        section_number: {
          type: "string",
          enum: Object.values(SectionEnum),
          example: SectionEnum.PART_ONE,
        },
        section_title: { type: "string", example: "Listening Section" },
        audio: {
          type: "string",
          format: "binary",
        },
        sub_groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_start: { type: "number", example: 1 },
              question_end: { type: "number", example: 10 },
              sub_title: { type: "string", example: "Listening Part 1" },
              question_type: {
                type: "string",
                enum: Object.values(ListeningQuestionType),
                example: ListeningQuestionType.MULTIPLE_CHOICE,
              },
            },
        },
        },
      },
    },
  })
  create(
    @Body() createSectionDto: CreateSectionDto,
    @UploadedFile() audio: File
  ) {
    return this.sectionsService.create(createSectionDto, audio);
  }

  @Get()
  @ApiOperation({ summary: "Get all sections" })
  @ApiResponse({
    status: 200,
    description: "Return all sections.",
    type: [CreateSectionDto],
  })
  @ApiResponse({ status: 404, description: "No sections found." })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "section",
    required: false,
    enum: SectionEnum,
    type: String,
  })
  findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("section") section?: SectionEnum
  ) {
    return this.sectionsService.findAll(page, limit, section);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a section by ID" })
  @ApiResponse({
    status: 200,
    description: "Return the section.",
    type: CreateSectionDto,
  })
  @ApiResponse({ status: 404, description: "Section not found." })
  @ApiParam({ name: "id", description: "Section ID", example: 1 })
  findOne(@Param("id") id: string) {
    return this.sectionsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a section by ID" })
  @ApiResponse({
    status: 200,
    description: "Section successfully updated.",
    type: UpdateSectionDto,
  })
  @ApiResponse({ status: 404, description: "Section not found." })
  @ApiParam({ name: "id", description: "Section ID", example: 1 })
  update(@Param("id") id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a section by ID" })
  @ApiResponse({ status: 200, description: "Section successfully deleted." })
  @ApiResponse({ status: 404, description: "Section not found." })
  @ApiParam({ name: "id", description: "Section ID", example: 1 })
  remove(@Param("id") id: string) {
    return this.sectionsService.remove(+id);
  }
}
