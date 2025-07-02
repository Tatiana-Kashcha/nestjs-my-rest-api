import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '0501234567' })
  number: string;
}
