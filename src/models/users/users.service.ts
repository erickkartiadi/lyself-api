import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: createUserDto
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    return user;
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: id
      }
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async markEmailAsConfirmed(email: string) {
    return this.prisma.user.update({
      where: {
        email: email
      },
      data: {
        isConfirmed: true
      }
    });
  }
}
