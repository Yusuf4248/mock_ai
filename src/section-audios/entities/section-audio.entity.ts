import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Section } from "../../sections/entities/section.entity";

@Entity("section-audio")
export class SectionAudio {
  @ApiProperty({
    example: 1,
    description: "Section audio unique ID",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "https://mockAI.uz/audio/example",
    description: "Audio url path",
  })
  @Column({ type: "varchar", nullable: true })
  file_path: string;

  @OneToOne(() => Section, (section) => section.audio, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  section: Section;
}
