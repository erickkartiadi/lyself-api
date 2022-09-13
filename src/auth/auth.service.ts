import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { UsersService } from 'src/models/users/users.service';
import EmailService from 'src/providers/email/email.service';
import JwtPaylaod from 'types/jwt-payload.interface';
import UserWithoutPass from 'types/user-without-pass.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithoutPass | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register({ email, name, password }: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    // if current registrant have email registered but haven't confirmed then delete that account
    const availableUser = await this.usersService.findByEmail(email);
    if (availableUser?.isConfirmed === false)
      await this.usersService.delete(availableUser.id);

    return this.usersService.create({
      email,
      name,
      password: hashedPassword
    });
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JwtPaylaod = {
      email: user.email,
      id: user.id,
      isConfirmed: user.isConfirmed
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async sendVerificationEmailLink(email: string) {
    const payload = { email: email };

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new InternalServerErrorException();

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION')
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      text: `
        Hi ${user.email} 👋🏻, thank you for registering at Lyself.

        Please confirm your email address via the link below:
        ${url}
      `
    });
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user?.isConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.usersService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
    });

    if (typeof payload === 'object' && 'email' in payload) {
      return payload.email;
    }

    throw new BadRequestException();
  }
}
