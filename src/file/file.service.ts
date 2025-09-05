import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";

@Injectable()
export class FileService {
  async uploadAudio(file: any, file_path: string) {
    try {
      const allowedExtensions = [".mp3", ".wav", ".aac", ".flac", ".ogg"];

      const ext = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException(`Fayl turi ruxsat etilmagan: ${ext}`);
      }
      const extension = path.extname(file.originalname);
      const fileName = uuid.v4() + extension;
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
      }
      fs.writeFileSync(path.join(file_path, fileName), file.buffer);
      return fileName;
    } catch (error) {
      console.log(error);
      // throw new InternalServerErrorException({
      //   message: "file saqlashda xatolik yuz berdi",
      // });
      return {
        message: "File saqlashda xatolik",
      };
    }
  }

  async uploadMedia(file: any, file_path: string) {
    try {
      const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp", ".svgs"];
      const ext = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException(`Fayl turi ruxsat etilmagan: ${ext}`);
      }
      const extension = path.extname(file.originalname);
      const fileName = uuid.v4() + extension;
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
      }
      fs.writeFileSync(path.join(file_path, fileName), file.buffer);
      return fileName;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: "file saqlashda xatolik yuz berdi",
      });
    }
  }
}
