import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userRepo.save({
      ...createUserDto,
    });
    return {
      message: "New user created",
      success: true,
      data: newUser,
    };
  }

  async findAll(page: number, limit: number) {
    const [users, total] = await this.userRepo.findAndCount({
      relations: [],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });
    return {
      message: "All users",
      success: true,
      total,
      data: users,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return {
      message: `User with ID-${id}`,
      success: true,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    await this.userRepo.update(id, updateUserDto);
    const user = await this.findOne(id);

    return {
      message: "User data updated",
      success: true,
      data: user,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepo.delete(id);

    return {
      message: "User deleted",
      success: true,
    };
  }

  async updateTokenHash(id: number, hash: string) {
    await this.userRepo.update(id, { refersh_token_hash: hash });
  }

  async findByTelegramId(telegram_id: number) {
    return this.userRepo.findOneBy({ telegram_id });
  }
}
