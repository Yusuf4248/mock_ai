import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubGroupQuestionDto } from "./dto/create-sub-group-question.dto";
import { UpdateSubGroupQuestionDto } from "./dto/update-sub-group-question.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SubGroupQuestion } from "./entities/sub-group-question.entity";
import { Repository } from "typeorm";
import { SectionsService } from "../sections/sections.service";
import { FileService } from "../file/file.service";
import * as path from "path";
import { QuestionOption } from "../question-options/entities/question-option.entity";

@Injectable()
export class SubGroupQuestionsService {
  constructor(
    @InjectRepository(SubGroupQuestion)
    private readonly subGroupQuestionRepo: Repository<SubGroupQuestion>,
    @InjectRepository(QuestionOption)
    private readonly questionOptionRepo: Repository<QuestionOption>,
    private readonly sectionService: SectionsService,
    private readonly fileService: FileService
  ) {}

  async create(
    createSubGroupQuestionDto: CreateSubGroupQuestionDto,
    photo: File
  ) {
    // is section exists
    const { data: section } = await this.sectionService.findOne(
      createSubGroupQuestionDto.sectionId
    );

    // is question already created
    const isAlreadyExists = await this.subGroupQuestionRepo.findOne({
      where: {
        section: { id: createSubGroupQuestionDto.sectionId },
        question_number: createSubGroupQuestionDto.question_number,
      },
    });
    if (isAlreadyExists) {
      throw new BadRequestException(
        `Question is already created for question-${createSubGroupQuestionDto.question_number}`
      );
    }
    const index = section.section_sub_group.findIndex(
      (subGroup) =>
        createSubGroupQuestionDto.question_number >= subGroup.question_start &&
        createSubGroupQuestionDto.question_number <= subGroup.question_end
    );
    // is question type is same as in db
    if (
      section.section_sub_group[index].question_type !==
      createSubGroupQuestionDto.question_type
    ) {
      throw new BadRequestException("Question type is incorrect");
    }

    // uploading photo(if exists)
    let fileName = "";
    if (photo) {
      const filePath = path.resolve(__dirname, "../..", "uploads", "photos");
      fileName = await this.fileService.uploadMedia(photo, filePath);
    }
    // creating new question
    const newQuestion = await this.subGroupQuestionRepo.save({
      ...createSubGroupQuestionDto,
      photo: `http://localhost:3000/photos/${fileName}`,
      section,
    });

    // creating question options
    let question_options: any;
    if (createSubGroupQuestionDto.question_options) {
      const questionOptions = createSubGroupQuestionDto.question_options.map(
        (option) =>
          this.questionOptionRepo.create({
            option_text: option.option_text,
            is_correct: option.is_correct || false, // Default to false if not provided
            subGroupQuestion: newQuestion, // Associate with the saved question
          })
      );
      question_options = await this.questionOptionRepo.save(questionOptions);
    }

    return {
      message: "Question created",
      data: { newQuestion, question_options },
    };
  }

  async findAll(): Promise<SubGroupQuestion[]> {
    const subGroupQuestions = await this.subGroupQuestionRepo.find();
    return subGroupQuestions;
  }

  async findOne(id: number): Promise<SubGroupQuestion> {
    const subGroupQuestion = await this.subGroupQuestionRepo.findOne({
      where: { id },
      relations: ["section", "answers", "question_option"], // Load related entities if needed
    });

    if (!subGroupQuestion) {
      throw new NotFoundException(`SubGroupQuestion with ID ${id} not found`);
    }

    return subGroupQuestion;
  }

  async update(
    id: number,
    updateSubGroupQuestionDto: UpdateSubGroupQuestionDto
  ): Promise<SubGroupQuestion> {
    const subGroupQuestion = await this.subGroupQuestionRepo.preload({
      id,
      ...updateSubGroupQuestionDto,
    });

    if (!subGroupQuestion) {
      throw new NotFoundException(`SubGroupQuestion with ID ${id} not found`);
    }

    // Handle section relationship if section_id is provided
    if (updateSubGroupQuestionDto.sectionId) {
      const { data: section } = await this.sectionService.findOne(
        updateSubGroupQuestionDto.sectionId
      );
      if (!section) {
        throw new NotFoundException(
          `Section with ID ${updateSubGroupQuestionDto.sectionId} not found`
        );
      }
      subGroupQuestion.section = section;
    }

    return this.subGroupQuestionRepo.save(subGroupQuestion);
  }

  async remove(id: number): Promise<void> {
    const subGroupQuestion = await this.findOne(id); // Reuse findOne to check existence
    await this.subGroupQuestionRepo.remove(subGroupQuestion);
  }
}
