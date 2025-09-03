import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../../common/enums/enums";

@Entity("users")
export class User {
  @ApiProperty({
    example: 1,
    description: "User's unique ID",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "John",
    description: "User's username",
  })
  @Column({ type: "varchar", nullable: false })
  username: string;

  @ApiProperty({
    example: 12345667,
    description: "User's telegram ID",
  })
  @Column({ type: "bigint", nullable: true })
  telegram_id: number;

  @ApiProperty({
    example: "student",
    description: "User's role",
  })
  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @ApiProperty({
    example: true,
    description: "Is user active or not",
  })
  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: "Is user(admin) creator or not",
  })
  @Column({ type: "boolean", default: false })
  is_creator: boolean;

  @ApiProperty({
    example: "qwertyukjhgfdsdfb",
    description: "User's hashed refresh token",
  })
  @Column({ type: "text", default: "" })
  refersh_token_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
