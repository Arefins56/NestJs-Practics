import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
// import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { UpdateTaskStatusDto } from './dto/update-task.dto';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
// import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto){
    return this.tasksService.getTasks(filterDto);
  }

  // @Get('/')
  // getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
  //   // console.log(filterDto);

  //   if(Object.keys(filterDto).length){
  //     // console.log(Object.keys(filterDto).length);
  //     return this.tasksService.getTaskWithFilters(filterDto);
  //   }else{
  //     return this.tasksService.getAllTasks();
  //   }

  //   // return this.tasksService.getAllTasks();
  // }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
    
  }


  @Post('/')
  // @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }


  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
   return this.tasksService.deleteTask(id);
  }

  @Patch('/:id')
  // @UsePipes(ValidationPipe)
  updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body() updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
    // console.log(status);

    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status);
  }
}
