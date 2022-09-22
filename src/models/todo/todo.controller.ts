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
import { TodoService } from './todo.service';

@Controller('todo')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

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
    @Body() updateTodoDto: CreateTodoDto
  ) {
    return this.todoService.update(req.user.id, id, updateTodoDto);
  }

  @Patch('toggle/:id')
  toggle(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body('isCompleted') isCompleted: boolean
  ) {
    return this.todoService.toggleCompleted(req.user.id, id, isCompleted);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.todoService.findAll(req.user.id);
  }
}
