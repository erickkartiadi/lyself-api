import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import JwtPaylaod from 'types/jwtPayload.interface';
import UserWithoutPassword from 'types/userWithoutPassword.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOne(email);

    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register({ email, name, password }: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword
    });

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JwtPaylaod = {
      email: user.email,
      id: user.id
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
