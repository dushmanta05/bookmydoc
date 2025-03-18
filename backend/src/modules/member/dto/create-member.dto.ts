import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({
    description: 'The user ID that this member is associated with',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ description: 'The address of the member' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'The age of the member' })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'The date of birth of the member',
    example: '1990-01-01',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  dob: Date;
}
