import {
  Controller,
  Get,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import RequestWithUser from 'types/request-with-user.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    return this.usersService.findAll();
  }
}
