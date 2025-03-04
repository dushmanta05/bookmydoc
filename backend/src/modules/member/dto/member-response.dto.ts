import { ApiProperty } from '@nestjs/swagger';

export class MemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
