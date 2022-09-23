import { Injectable } from '@nestjs/common';
import { Todo, User } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<
    | (User & {
        todos: Todo[];
      })
    | null
  > {
    return this.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        todos: true
      }
    });
  }

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        userId,
        completed: createTodoDto.completed,
        todo: createTodoDto.todo,
        importanceLevel: createTodoDto.importanceLevel,
        reminderTime: createTodoDto.reminderTime,
        note: createTodoDto.note
      }
    });
  }

  async delete(userId: string, id: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        todos: {
          delete: { id: id }
        }
      },
      include: {
        todos: true
      }
    });
  }

  async update(userId: string, id: string, updateTodoDto: UpdateTodoDto) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        todos: {
          update: {
            where: {
              id: id
            },
            data: updateTodoDto
          }
        }
      },
      include: {
        todos: true
      }
    });
  }
}
