import {
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '@enums/user.enum';
import { RegexPatterns } from '@utils//regex.util';

export class UpdateUserDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @Matches(RegexPatterns.MOBILE, {
    message: 'Mobile number must be exactly 10 digits',
  })
  mobile?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  userType?: UserRole;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(RegexPatterns.PASSWORD, {
    message:
      'Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password?: string;
}
