import {
  Controller,
  Get,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto | null> {
    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID must be a valid number');
    }

    const user = await this.usersService.findOneUserId(parsedId);

    if (!user) {
      throw new NotFoundException(`User with ID ${parsedId} not found`);
    }

    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
