import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMemberDto {
  @ApiPropertyOptional({ description: 'The address of the member' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'The age of the member' })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    description: 'The date of birth of the member',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => value && new Date(value))
  dob?: Date;
}
