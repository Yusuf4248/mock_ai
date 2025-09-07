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
  FilesInterceptor,
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

  // @Post()
  // @UseInterceptors(FileInterceptor("photo"))
  // @ApiConsumes("multipart/form-data")
  // @ApiOperation({ summary: "Create a new SubGroup Question" })
  // @ApiResponse({
  //   status: 201,
  //   description: "The question has been successfully created.",
  //   type: SubGroupQuestion,
  // })
  // @ApiResponse({ status: 400, description: "Bad request" })
  // @ApiBody({
  //   schema: {
  //     type: "object",
  //     properties: {
  //       question_type: {
  //         type: "string",
  //         enum: Object.values(ListeningQuestionType),
  //         example: ListeningQuestionType.MULTIPLE_CHOICE,
  //       },
  //       question_number: {
  //         type: "integer",
  //         example: 5,
  //         minimum: 1,
  //         maximum: 40,
  //         description: "Number of the question (1–40)",
  //       },
  //       question_text: {
  //         type: "string",
  //         example: "What is the capital of France?",
  //         description: "The text of the question",
  //       },
  //       answer: {
  //         type: "string",
  //         example: "Paris",
  //         description: "Correct answer for question",
  //       },
  //       photo: {
  //         type: "string",
  //         format: "binary",
  //         example: "image.jpg",
  //         description: "Optional photo related to the question",
  //       },
  //       sectionId: {
  //         type: "integer",
  //         example: 1,
  //         description: "ID of the section this question belongs to",
  //       },
  //       question_options: {
  //         type: "array",
  //         items: {
  //           type: "object",
  //           properties: {
  //             option_text: { type: "string", example: "A: Something" },
  //             is_correct: { type: "boolean", example: false },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // create(
  //   @Body() createSubGroupQuestionDto: CreateSubGroupQuestionDto,
  //   @UploadedFile() photo: File
  // ) {
  //   return this.subGroupQuestionsService.create(
  //     createSubGroupQuestionDto,
  //     photo
  //   );
  // }

  // @Post()
  // @UseInterceptors(FilesInterceptor("photos"))
  // @ApiConsumes("multipart/form-data")
  // @ApiOperation({ summary: "Create multiple SubGroup Questions" })
  // @ApiResponse({
  //   status: 201,
  //   description: "The questions have been successfully created.",
  //   type: [SubGroupQuestion],
  // })
  // @ApiResponse({ status: 400, description: "Bad request" })
  // @ApiBody({
  //   schema: {
  //     type: "object",
  //     properties: {
  //       questions: {
  //         type: "array",
  //         items: {
  //           type: "object",
  //           properties: {
  //             question_type: {
  //               type: "string",
  //               enum: Object.values(ListeningQuestionType),
  //               example: ListeningQuestionType.MULTIPLE_CHOICE,
  //             },
  //             question_number: {
  //               type: "integer",
  //               example: 5,
  //               minimum: 1,
  //               maximum: 40,
  //               description: "Number of the question (1–40)",
  //             },
  //             question_text: {
  //               type: "string",
  //               example: "What is the capital of France?",
  //               description: "The text of the question",
  //             },
  //             answer: {
  //               type: "string",
  //               example: "Paris",
  //               description: "Correct answer for question",
  //             },
  //             sectionId: {
  //               type: "integer",
  //               example: 1,
  //               description: "ID of the section this question belongs to",
  //             },
  //             question_options: {
  //               type: "array",
  //               items: {
  //                 type: "object",
  //                 properties: {
  //                   option_text: { type: "string", example: "A: Something" },
  //                   is_correct: { type: "boolean", example: false },
  //                 },
  //               },
  //             },
  //             photoIndex: {
  //               type: "integer",
  //               example: 0,
  //               description:
  //                 "Index of the photo in uploaded files array (e.g. 0 = first photo, 1 = second photo)",
  //             },
  //           },
  //         },
  //       },
  //       photos: {
  //         type: "array",
  //         items: {
  //           type: "string",
  //           format: "binary",
  //         },
  //         description: "Array of photo files related to questions",
  //       },
  //       sectionId: {
  //         type: "integer",
  //         example: 1,
  //         description: "ID of the section this question belongs to",
  //       },
  //     },
  //   },
  // })
  // createMany(
  //   @Body() body: { sectionId: number; questions: CreateSubGroupQuestionDto[] },
  //   @UploadedFiles() photos: File[]
  // ) {
  //   return this.subGroupQuestionsService.create(
  //     body.sectionId,
  //     body.questions,
  //     photos
  //   );
  // }

  @Post("create-many")
  @ApiOperation({ summary: "Create multiple questions (batch)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_type: {
                type: "string",
                enum: [
                  "MULTIPLE_CHOICE",
                  "TRUE_FALSE",
                  "MATCHING",
                  "MAP_LABELING",
                  "DIAGRAM",
                  "COMPLETION",
                ],
                example: "MULTIPLE_CHOICE",
              },
              question_number: {
                type: "integer",
                example: 5,
              },
              question_text: {
                type: "string",
                example: "What is the capital of France?",
              },
              answer: {
                type: "string",
                example: "Paris",
              },
              sectionId: {
                type: "integer",
                example: 1,
              },
              question_options: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    option_text: { type: "string", example: "A: Paris" },
                    is_correct: { type: "boolean", example: true },
                  },
                },
              },
              blanks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    blank_position: { type: "integer", example: 1 },
                    correct_answer: { type: "string", example: "Eiffel Tower" },
                  },
                },
              },
              photoIndex: {
                type: "integer",
                example: 0,
                description: "Index of the photo in uploaded files array",
              },
            },
          },
        },
        photos: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Upload related photo files",
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("photos"))
  async createMany(
    @Body("questions") questions: string,
    @UploadedFiles() photos: Express.Multer.File[]
  ) {
    const parsedQuestions = JSON.parse(questions);
    return this.subGroupQuestionsService.create(parsedQuestions, photos);
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
