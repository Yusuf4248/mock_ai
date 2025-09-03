import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("otp")
export class Otp {
  @ApiProperty({
    example: "123456",
    description: "Unikal OTP ID (UUID)",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: 493827,
    description: "Yuborilgan bir martalik parol (OTP)",
  })
  @Column({ type: "integer" })
  otp: number;

  @ApiProperty({
    example: "2025-06-02T12:00:00Z",
    description: "OTP amal qilish muddati (vaqti)",
  })
  @Column({ type: "timestamp" })
  expiration_time: Date;

  @ApiProperty({
    example: false,
    description: "Foydalanuvchi OTP kodni tasdiqlagani yoki yo'qligi",
  })
  @Column({ type: "boolean", default: false })
  verified: boolean;

  @ApiProperty({
    example: 1234567,
    description: "Foydalanuvchining telegram id si",
  })
  @Column({ type: "bigint", default: 1, nullable: true })
  telegram_id: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
