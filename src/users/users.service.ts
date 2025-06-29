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
        token: accessToken,
      });

      const user = {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      };

      return {
        user,
        token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  // функції, які використовуються в AuthService
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

  async updateToken(userId: number, currentToken: string) {
    await this.usersRepository.update(userId, { token: currentToken });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async isTokenValid(payload: any): Promise<boolean> {
    const userExists = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    return userExists?.token ? true : false;
  }

  // функції, які використовуються в UsersController
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();

    return users.map(({ id, email, name, token }) => ({
      user: { id, email, name },
      token,
    }));
  }

  async findOneUserId(id: number): Promise<UserResponseDto | null> {
    const options: FindOneOptions<User> = { where: { id } };
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      return null;
    }
    const { id: userId, name, email, token } = user;
    return { user: { id: userId, name, email }, token };
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

// складові токена - <Header>.<Payload>.<Signature>
