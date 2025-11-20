import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { STRING_LENGTH } from '../../common/constants/validation.constants';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(STRING_LENGTH.MAX.EMAIL, {
    message: `Email must not exceed ${STRING_LENGTH.MAX.EMAIL} characters`,
  })
  email: string;

  @IsString()
  @MinLength(STRING_LENGTH.MIN.PASSWORD, {
    message: `Password must be at least ${STRING_LENGTH.MIN.PASSWORD} characters`,
  })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(STRING_LENGTH.MIN.NAME)
  @MaxLength(STRING_LENGTH.MAX.NAME)
  name?: string;
}
