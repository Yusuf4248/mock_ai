import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubGroupQuestionDto } from "./dto/create-sub-group-question.dto";
import { UpdateSubGroupQuestionDto } from "./dto/update-sub-group-question.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SubGroupQuestion } from "./entities/sub-group-question.entity";
import { DataSource, Repository } from "typeorm";
import { SectionsService } from "../sections/sections.service";
import { FileService } from "../file/file.service";
import * as path from "path";
import { QuestionOption } from "../question-options/entities/question-option.entity";
import { QuestionBlank } from "../question-blanks/entities/question-blank.entity";
import { log } from "console";

@Injectable()
export class SubGroupQuestionsService {
  constructor(
    @InjectRepository(SubGroupQuestion)
    private readonly subGroupQuestionRepo: Repository<SubGroupQuestion>,
    @InjectRepository(QuestionOption)
    private readonly questionOptionRepo: Repository<QuestionOption>,
    @InjectRepository(QuestionBlank)
    private readonly questionBlankRepo: Repository<QuestionBlank>,
    private readonly sectionService: SectionsService,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource
  ) {}

  // async create(
  //   createSubGroupQuestionDto: CreateSubGroupQuestionDto[],
  //   photo: File[],
  //   sectionId: number
  // ) {
  //   console.log(createSubGroupQuestionDto);
  //   console.log(photo);
  //   console.log(sectionId);
  //   throw new BadRequestException("qwerty");
  //   // // is section exists
  //   // const { data: section } = await this.sectionService.findOne(
  //   //   createSubGroupQuestionDto.sectionId
  //   // );

  //   // // is question already created
  //   // const isAlreadyExists = await this.subGroupQuestionRepo.findOne({
  //   //   where: {
  //   //     section: { id: createSubGroupQuestionDto.sectionId },
  //   //     question_number: createSubGroupQuestionDto.question_number,
  //   //   },
  //   // });
  //   // if (isAlreadyExists) {
  //   //   throw new BadRequestException(
  //   //     `Question is already created for question-${createSubGroupQuestionDto.question_number}`
  //   //   );
  //   // }
  //   // const index = section.section_sub_group.findIndex(
  //   //   (subGroup) =>
  //   //     createSubGroupQuestionDto.question_number >= subGroup.question_start &&
  //   //     createSubGroupQuestionDto.question_number <= subGroup.question_end
  //   // );
  //   // // is question type is same as in db
  //   // if (
  //   //   section.section_sub_group[index].question_type !==
  //   //   createSubGroupQuestionDto.question_type
  //   // ) {
  //   //   throw new BadRequestException("Question type is incorrect");
  //   // }

  //   // // uploading photo(if exists)
  //   // let fileName = "";
  //   // if (photo) {
  //   //   const filePath = path.resolve(__dirname, "../..", "uploads", "photos");
  //   //   fileName = await this.fileService.uploadMedia(photo, filePath);
  //   // }
  //   // // creating new question
  //   // const newQuestion = await this.subGroupQuestionRepo.save({
  //   //   ...createSubGroupQuestionDto,
  //   //   photo: `http://localhost:3000/photos/${fileName}`,
  //   //   section,
  //   // });

  //   // // creating question options
  //   // let question_options: any;
  //   // if (createSubGroupQuestionDto.question_options) {
  //   //   const questionOptions = createSubGroupQuestionDto.question_options.map(
  //   //     (option) =>
  //   //       this.questionOptionRepo.create({
  //   //         option_text: option.option_text,
  //   //         is_correct: option.is_correct || false, // Default to false if not provided
  //   //         subGroupQuestion: newQuestion, // Associate with the saved question
  //   //       })
  //   //   );
  //   //   question_options = await this.questionOptionRepo.save(questionOptions);
  //   // }

  //   // return {
  //   //   message: "Question created",
  //   //   data: { newQuestion, question_options },
  //   // };
  // }

  // async create(
  //   sectionId: number,
  //   createSubGroupQuestionsDto: CreateSubGroupQuestionDto[],
  //   photos: File[]
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   // queryRunner bilan transaction boshlaymiz
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const { data: section } = await this.sectionService.findOne(sectionId);

  //     const results: {
  //       newQuestion: SubGroupQuestion;
  //       question_options: any[];
  //     }[] = [];

  //     for (const dto of createSubGroupQuestionsDto) {
  //       // Duplicate check
  //       const isAlreadyExists = await queryRunner.manager.findOne(
  //         SubGroupQuestion,
  //         {
  //           where: {
  //             section: { id: sectionId },
  //             question_number: dto.question_number,
  //           },
  //         }
  //       );

  //       if (isAlreadyExists) {
  //         throw new BadRequestException(
  //           `Question is already created for question-${dto.question_number}`
  //         );
  //       }

  //       // SubGroup check
  //       const index = section.section_sub_group.findIndex(
  //         (subGroup) =>
  //           dto.question_number >= subGroup.question_start &&
  //           dto.question_number <= subGroup.question_end
  //       );

  //       if (
  //         section.section_sub_group[index].question_type !== dto.question_type
  //       ) {
  //         throw new BadRequestException("Question type is incorrect");
  //       }

  //       // Photo upload
  //       let fileName = "";
  //       if (typeof dto.photoIndex === "number" && photos[dto.photoIndex]) {
  //         const filePath = path.resolve(
  //           __dirname,
  //           "../..",
  //           "uploads",
  //           "photos"
  //         );
  //         fileName = await this.fileService.uploadMedia(
  //           photos[dto.photoIndex],
  //           filePath
  //         );
  //       }

  //       // New question yaratish
  //       const newQuestion = queryRunner.manager.create(SubGroupQuestion, {
  //         ...dto,
  //         photo: `http://localhost:3000/photos/${fileName}`,
  //         section,
  //       });
  //       await queryRunner.manager.save(SubGroupQuestion, newQuestion);

  //       // Question options
  //       let question_options: any;
  //       if (dto.question_options) {
  //         const questionOptions = dto.question_options.map((option) =>
  //           this.questionOptionRepo.create({
  //             option_text: option.option_text,
  //             is_correct: option.is_correct || false,
  //             subGroupQuestion: newQuestion,
  //           })
  //         );
  //         question_options = await queryRunner.manager.save(questionOptions);
  //       }

  //       results.push({ newQuestion, question_options });
  //     }

  //     // Hammasi muvaffaqiyatli bo‘lsa → commit
  //     await queryRunner.commitTransaction();

  //     return {
  //       message: `${results.length} questions created successfully`,
  //       data: results,
  //     };
  //   } catch (error) {
  //     // Xato bo‘lsa → rollback
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     // Har holda queryRunner ni release qilamiz
  //     await queryRunner.release();
  //   }
  // }

  // async create(questions: any[], photos: Express.Multer.File[]) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const results: SubGroupQuestion[] = [];

  //     for (const q of questions) {
  //       // 📌 photoIndex orqali faylni bog‘lash
  //       let photoUrl = "";
  //       if (q.photoIndex !== null && q.photoIndex !== undefined) {
  //         const file = photos[q.photoIndex];
  //         if (file) {
  //           const uploadDir = path.resolve(
  //             __dirname,
  //             "../..",
  //             "uploads/photos"
  //           );
  //           if (!fs.existsSync(uploadDir))
  //             fs.mkdirSync(uploadDir, { recursive: true });
  //           const fileName = `${Date.now()}-${file.originalname}`;
  //           const filePath = path.join(uploadDir, fileName);
  //           fs.writeFileSync(filePath, file.buffer);
  //           photoUrl = `http://localhost:3000/photos/${fileName}`;
  //         }
  //       }

  //       // 📌 asosiy question yaratish
  //       const newQuestion = queryRunner.manager.create(SubGroupQuestion, {
  //         question_type: q.question_type,
  //         question_number: q.question_number,
  //         question_text: q.question_text,
  //         description: q.description || null,
  //         answer: q.answer || null,
  //         sectionId: q.sectionId,
  //         photo: photoUrl,
  //       });

  //       const savedQuestion = await queryRunner.manager.save(newQuestion);

  //       // 📌 options yaratish
  //       if (q.question_options && q.question_options.length > 0) {
  //         const optionEntities = q.question_options.map((opt) =>
  //           this.questionOptionRepo.create({
  //             option_text: opt.option_text,
  //             is_correct: opt.is_correct || false,
  //             subGroupQuestion: savedQuestion,
  //           })
  //         );
  //         await queryRunner.manager.save(optionEntities);
  //       }

  //       // 📌 blanks yaratish
  //       if (q.question_blanks && q.question_blanks.length > 0) {
  //         const blankEntities = q.question_blanks.map((blank: QuestionBlank) =>
  //           this.questionBlankRepo.create({
  //             blank_position: blank.blank_position,
  //             correct_answer: blank.correct_answer,
  //             subGroupQuestion: savedQuestion,
  //           })
  //         );
  //         await queryRunner.manager.save(blankEntities);
  //       }

  //       results.push(savedQuestion);
  //     }

  //     await queryRunner.commitTransaction();
  //     return { message: "Questions created successfully", data: results };
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw new InternalServerErrorException(err.message);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async create(questions: any[], photos: Express.Multer.File[]) {
    console.log(questions);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException("Questions list cannot be empty");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const results: SubGroupQuestion[] = [];

      for (const [index, q] of questions.entries()) {
        // === Validation ===
        const { data: section } = await this.sectionService.findOne(
          q.sectionId
        );

        const index = section.section_sub_group.findIndex(
          (subGroup) =>
            q.question_number >= subGroup.question_start &&
            q.question_number <= subGroup.question_end
        );
        // is question type is same as in db
        if (
          section.section_sub_group[index].question_type !== q.question_type
        ) {
          throw new BadRequestException("Question type is incorrect");
        }

        
        if (!q.question_text || typeof q.question_text !== "string") {
          throw new BadRequestException(
            `Question #${index + 1}: 'question_text' is required`
          );
        }

        if (
          (!q.question_options || q.question_options.length === 0) &&
          (!q.question_blanks || q.question_blanks.length === 0)
        ) {
          throw new BadRequestException(
            `Question #${index + 1}: at least one option or blank is required`
          );
        }

        // === Save photo if provided ===
        let photoUrl = "";
        if (q.photoIndex !== undefined) {
          if (!photos || !photos[q.photoIndex]) {
            throw new BadRequestException(
              `Question #${index + 1}: invalid photoIndex`
            );
          }
          const uploadDir = path.resolve(__dirname, "../../uploads/photos");
          const fileName = await this.fileService.uploadMedia(
            photos[q.photoIndex],
            uploadDir
          );
          photoUrl = `/uploads/photos/${fileName}`;
        }

        // === Save question ===
        const savedQuestion = await queryRunner.manager.save(
          queryRunner.manager.create(SubGroupQuestion, {
            question_type: q.question_type,
            question_number: q.question_number,
            question_text: q.question_text,
            description: q.description || null,
            answer: q.answer || null,
            sectionId: q.sectionId,
            photo: photoUrl,
          })
        );

        // === Save options ===
        if (q.question_options?.length) {
          const optionsToSave = q.question_options.map((opt, optIndex) => {
            if (!opt.option_text || typeof opt.option_text !== "string") {
              throw new BadRequestException(
                `Question #${index + 1}, Option #${optIndex + 1}: 'option_text' is required`
              );
            }
            return {
              option_text: opt.option_text,
              is_correct: !!opt.is_correct,
              subGroupQuestion: savedQuestion,
            };
          });

          await queryRunner.manager.insert(QuestionOption, optionsToSave);
        }

        // === Save blanks ===
        if (q.question_blanks?.length) {
          const blanksToSave = q.question_blanks.map((blank, blankIndex) => {
            if (
              typeof blank.blank_position !== "number" ||
              blank.blank_position < 0
            ) {
              throw new BadRequestException(
                `Question #${index + 1}, Blank #${blankIndex + 1}: 'blank_position' must be a positive number`
              );
            }
            if (
              !blank.correct_answer ||
              typeof blank.correct_answer !== "string"
            ) {
              throw new BadRequestException(
                `Question #${index + 1}, Blank #${blankIndex + 1}: 'correct_answer' is required`
              );
            }
            return {
              blank_position: blank.blank_position,
              correct_answer: blank.correct_answer,
              subGroupQuestion: savedQuestion,
            };
          });

          await queryRunner.manager.insert(QuestionBlank, blanksToSave);
        }

        results.push(savedQuestion);
      }

      await queryRunner.commitTransaction();
      return { message: "Questions created successfully", data: results };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.message || err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<SubGroupQuestion[]> {
    const subGroupQuestions = await this.subGroupQuestionRepo.find();
    return subGroupQuestions;
  }

  async findOne(id: number): Promise<SubGroupQuestion> {
    const subGroupQuestion = await this.subGroupQuestionRepo.findOne({
      where: { id },
      relations: ["section", "answers", "question_option"],
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
