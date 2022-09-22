import { TodoImportanceLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  todo: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  note: string;

  @IsEnum(TodoImportanceLevel)
  importanceLevel: TodoImportanceLevel;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  reminderTime: Date;
}
