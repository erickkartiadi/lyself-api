import { Injectable } from '@nestjs/common';
import { Todo, User } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';

import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        todos: {
          create: createTodoDto
        }
      }
    });
  }

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

  async delete(userId: string, id: string) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        todos: {
          delete: { id: id }
        }
      }
    });
  }

  async update(userId: string, id: string, updateTodoDto: CreateTodoDto) {
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
      }
    });
  }

  async toggleCompleted(userId: string, id: string, isCompleted: boolean) {
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
            data: {
              completed: isCompleted
            }
          }
        }
      }
    });
  }
}
