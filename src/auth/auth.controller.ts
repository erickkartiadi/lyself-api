import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import PrismaError from 'types/prismaError.enum';
import RequestWithUser from 'types/requestWithUser.interface';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('/auth/register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = await this.authService.register(createUserDto);
      return user;
    } catch (err: any) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === PrismaError.UniqueViolation) {
          throw new ConflictException('Email is already used');
        }
      }

      throw new InternalServerErrorException();
    }
  }
}
