import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @IsNotEmpty()
  description: string;
  
}