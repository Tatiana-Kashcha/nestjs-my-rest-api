import { ApiProperty } from '@nestjs/swagger';
class UserData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

export class UserResponseDto {
  user: UserData;
  @ApiProperty({ example: 'JWT' })
  token: string;
}
