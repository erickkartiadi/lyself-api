import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'constant/constant';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least eight characters, one number, one uppercase, one lowercase letter'
  })
  password: string;
}
