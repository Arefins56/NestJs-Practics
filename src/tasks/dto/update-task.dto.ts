import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskStatusDto {

  
  @IsEnum(TaskStatus)
  status: TaskStatus;
  
}
