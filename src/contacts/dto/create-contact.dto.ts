import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '0501234567' })
  number: string;
}
