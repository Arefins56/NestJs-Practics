import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.model';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
