import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;
}
