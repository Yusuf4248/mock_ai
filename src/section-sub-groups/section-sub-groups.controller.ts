import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { SectionSubGroupsService } from "./section-sub-groups.service";
import { CreateSectionSubGroupDto } from "./dto/create-section-sub-group.dto";
import { SectionSubGroup } from "./entities/section-sub-group.entity";
import { UpdateSectionSubGroupDto } from "./dto/update-section-sub-group.dto";
import { ListeningQuestionType } from "../common/enums/enums";

@ApiTags("Section Sub Groups")
@Controller("section-sub-groups")
export class SectionSubGroupsController {
  constructor(
    private readonly sectionSubGroupService: SectionSubGroupsService
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create new section sub-groups (with multiple sub groups)",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        sectionId: { type: "integer", example: 1 },
        sub_groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_start: { type: "integer", example: 1 },
              question_end: { type: "integer", example: 10 },
              sub_title: { type: "string", example: "Listening Part 1" },
              question_type: {
                type: "string",
                enum: [ListeningQuestionType],
                example: ListeningQuestionType.MULTIPLE_CHOICE,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Section sub-groups created successfully",
    type: [SectionSubGroup],
  })
  async create(@Body() createDto: CreateSectionSubGroupDto) {
    return this.sectionSubGroupService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all section sub-groups" })
  @ApiResponse({
    status: 200,
    description: "List of section sub-groups",
    type: [SectionSubGroup],
  })
  findAll() {
    return this.sectionSubGroupService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a section sub-group by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Section sub-group found",
    type: SectionSubGroup,
  })
  @ApiResponse({ status: 404, description: "Section sub-group not found" })
  findOne(@Param("id") id: number) {
    return this.sectionSubGroupService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a section sub-group" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateSectionSubGroupDto })
  @ApiResponse({
    status: 200,
    description: "Section sub-group updated successfully",
    type: SectionSubGroup,
  })
  @ApiResponse({ status: 404, description: "Section sub-group not found" })
  update(@Param("id") id: number, @Body() updateDto: UpdateSectionSubGroupDto) {
    return this.sectionSubGroupService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a section sub-group" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "Section sub-group deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Section sub-group not found" })
  remove(@Param("id") id: number) {
    return this.sectionSubGroupService.remove(id);
  }
}
