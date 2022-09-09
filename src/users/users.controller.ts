import {
  Controller,
  Get,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'types/requestWithUser.interface';

import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    console.log(req.user);
    console.log(process.env.JWT_EXPIRES);
    return this.usersService.findAll();
  }
}
