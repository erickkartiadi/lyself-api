import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { UsersService } from 'src/models/users/users.service';
import PrismaError from 'types/prisma-error.enum';
import RequestWithUser from 'types/request-with-user.interface';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenDto } from './dto/token.dto';
import { EmailConfirmationGuard } from './guards/email-confirmation.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private userService: UsersService
  ) {}

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('register')
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
  async confirm(@Query(new ValidationPipe()) { token }: TokenDto, @Res() res: Response) {
    try {
      const email = await this.authService.decodeConfirmationToken(token);
      await this.authService.confirmEmail(email);

      const redirectUrl = this.configService.get('EMAIL_CONFIRMATION_REDIRECT_URL');
      return res.redirect(redirectUrl);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation link is expired');
      }

      throw new BadRequestException('Invalid link');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body(new ValidationPipe()) { email }: ForgotPasswordDto) {
    return this.authService.sendForgotPasswordLink(email);
  }

  @Get('reset-password/:token')
  @Render('reset-password')
  async resetPasswordScreen(@Param(new ValidationPipe()) { token }: TokenDto) {
    try {
      await this.authService.decodeForgotPasswordToken(token);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password link is expired');
      }
      throw new BadRequestException('Invalid link');
    }
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body(new ValidationPipe())
    resetPasswordDto: ResetPasswordDto,
    @Param(new ValidationPipe()) { token }: TokenDto
  ) {
    try {
      const email = await this.authService.decodeForgotPasswordToken(token);
      await this.userService.updatePassword(email, resetPasswordDto.password);
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password link is expired');
      }
      throw new BadRequestException('Invalid link');
    }
  }
}
