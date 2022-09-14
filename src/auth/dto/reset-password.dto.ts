import { IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'constant/constant';

export class ResetPasswordDto {
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least eight characters, one number, one uppercase, one lowercase letter'
  })
  password: string;
}
