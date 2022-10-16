import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';


export class UpdateTaskStatusDto {
  
  @IsEnum(TaskStatus)
  // @Transform(({value}) => value && value.toUpperCase())
  status: TaskStatus;
}
