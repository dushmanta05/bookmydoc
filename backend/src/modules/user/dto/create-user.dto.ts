import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '@enums/user.enum';
import { RegexPatterns } from '@utils//regex.util';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(RegexPatterns.MOBILE, {
    message: 'Mobile number must be exactly 10 digits',
  })
  mobile: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  userType: UserRole;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(RegexPatterns.PASSWORD, {
    message:
      'Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string;
}
