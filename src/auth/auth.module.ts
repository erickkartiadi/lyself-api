import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfigAsync } from 'src/config/jwt.config';
import { UsersModule } from 'src/models/users/users.module';
import { EmailModule } from 'src/providers/email/email.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    EmailModule,
    JwtModule.registerAsync(jwtConfigAsync)
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
