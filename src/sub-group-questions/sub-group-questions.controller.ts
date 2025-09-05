import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { SubGroupQuestionsService } from "./sub-group-questions.service";
import { CreateSubGroupQuestionDto } from "./dto/create-sub-group-question.dto";
import { UpdateSubGroupQuestionDto } from "./dto/update-sub-group-question.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from "@nestjs/swagger";
import { SubGroupQuestion } from "./entities/sub-group-question.entity";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { ListeningQuestionType } from "../common/enums/enums";
import { diskStorage } from "multer";
import { extname } from "path";

@ApiTags("SubGroupQuestions")
@Controller("sub-group-questions")
export class SubGroupQuestionsController {
  constructor(
    private readonly subGroupQuestionsService: SubGroupQuestionsService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("photo"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Create a new SubGroup Question" })
  @ApiResponse({
    status: 201,
    description: "The question has been successfully created.",
    type: SubGroupQuestion,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        question_type: {
          type: "string",
          enum: Object.values(ListeningQuestionType),
          example: ListeningQuestionType.MULTIPLE_CHOICE,
        },
        question_number: {
          type: "integer",
          example: 5,
          minimum: 1,
          maximum: 40,
          description: "Number of the question (1–40)",
        },
        question_text: {
          type: "string",
          example: "What is the capital of France?",
          description: "The text of the question",
        },
        answer: {
          type: "string",
          example: "Paris",
          description: "Correct answer for question",
        },
        photo: {
          type: "string",
          format: "binary",
          example: "image.jpg",
          description: "Optional photo related to the question",
        },
        sectionId: {
          type: "integer",
          example: 1,
          description: "ID of the section this question belongs to",
        },
        question_options: {
          type: "array",
          items: {
            type: "object",
            properties: {
              option_text: { type: "string", example: "A: Something" },
              is_correct: { type: "boolean", example: false },
            },
          },
        },
      },
    },
  })
  create(
    @Body() createSubGroupQuestionDto: CreateSubGroupQuestionDto,
    @UploadedFile() photo: File
  ) {
    return this.subGroupQuestionsService.create(
      createSubGroupQuestionDto,
      photo
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all SubGroup Questions" })
  @ApiResponse({
    status: 200,
    description: "Return all questions",
    type: [SubGroupQuestion],
  })
  findAll() {
    return this.subGroupQuestionsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get SubGroup Question by ID" })
  @ApiResponse({
    status: 200,
    description: "Return one question",
    type: SubGroupQuestion,
  })
  @ApiResponse({ status: 404, description: "Question not found" })
  findOne(@Param("id") id: string) {
    return this.subGroupQuestionsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update SubGroup Question by ID" })
  @ApiResponse({
    status: 200,
    description: "The question has been successfully updated.",
    type: SubGroupQuestion,
  })
  @ApiResponse({ status: 404, description: "Question not found" })
  update(
    @Param("id") id: string,
    @Body() updateSubGroupQuestionDto: UpdateSubGroupQuestionDto
  ) {
    return this.subGroupQuestionsService.update(+id, updateSubGroupQuestionDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete SubGroup Question by ID" })
  @ApiResponse({
    status: 200,
    description: "The question has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Question not found" })
  remove(@Param("id") id: string) {
    return this.subGroupQuestionsService.remove(+id);
  }
}
