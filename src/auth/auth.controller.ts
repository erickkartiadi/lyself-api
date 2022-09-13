import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import PrismaError from 'types/prisma-error.enum';
import RequestWithUser from 'types/request-with-user.interface';

import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { EmailConfirmationGuard } from './guards/email-confirmation.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('/auth/register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = await this.authService.register(createUserDto);
      await this.authService.sendVerificationEmailLink(user.email);
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

  @Get('confirm')
  async confirm(@Query() { token }: ConfirmEmailDto, @Res() res: Response) {
    try {
      const email = await this.authService.decodeConfirmationToken(token);
      await this.authService.confirmEmail(email);

      const redirectUrl = this.configService.get('EMAIL_CONFIRMATION_REDIRECT_URL');
      res.redirect(redirectUrl);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation link is expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }

  // TODO Resending confirmation link
}
