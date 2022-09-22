import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { TodoModule } from './models/todo/todo.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    UsersModule,
    AuthModule,
    TodoModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
