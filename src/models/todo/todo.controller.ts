import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'types/request-with-user.interface';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

// TODO add GetUser decorator

@Controller('todo')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.todoService.findAll(req.user.id);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: RequestWithUser) {
    return this.todoService.create(req.user.id, createTodoDto);
  }

  @Delete(':id')
  delete(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.todoService.delete(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    return this.todoService.update(req.user.id, id, updateTodoDto);
  }
}
