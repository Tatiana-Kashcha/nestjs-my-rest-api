import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // створюємо user без token
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      // зберігаємо user щоб отримати id для створення token
      const savedUser = await this.usersRepository.save(newUser);

      const payload = {
        sub: savedUser.id,
        username: savedUser.name,
        email: savedUser.email,
      };
      const accessToken = this.jwtService.sign(payload);

      // оновлюємо token у user
      await this.usersRepository.update(savedUser.id, {
        currentToken: accessToken,
      });

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        currentToken: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(name: string): Promise<User | null> {
    const options: FindOneOptions<User> = { where: { name } };
    const user = await this.usersRepository.findOne(options);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const options: FindOneOptions<User> = { where: { email } };
    const user = await this.usersRepository.findOne(options);
    return user;
  }

  async updateToken(userId: number, token: string) {
    await this.usersRepository.update(userId, { currentToken: token });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
