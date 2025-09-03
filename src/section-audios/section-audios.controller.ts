import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { SectionAudiosService } from "./section-audios.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@Controller("section-audios")
export class SectionAudiosController {
  constructor(private readonly sectionAudiosService: SectionAudiosService) {}

  @Post(":id/upload")
  @UseInterceptors(FileInterceptor("audio"))
  @ApiOperation({ summary: "Upload section audio" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        audio: {
          type: "string",
          format: "binary",
          description: "Audio file to upload (MP3, WAV, etc.)",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Audio uploaded successfully." })
  @ApiResponse({ status: 400, description: "Bad request or invalid file." })
  async uploadSectionAudio(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() audio: File
  ) {
    return this.sectionAudiosService.uploadSectionAudio(id, audio);
  }
}
