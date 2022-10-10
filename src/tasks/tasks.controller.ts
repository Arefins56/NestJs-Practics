import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    // console.log(filterDto);

    if(Object.keys(filterDto).length){
      // console.log(Object.keys(filterDto).length);
      return this.tasksService.getTaskWithFilters(filterDto);
    }else{
      return this.tasksService.getAllTasks();
    }
    
    // return this.tasksService.getAllTasks();
  }


  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);

  }


  @Post('/')
  // @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }


  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
  

  @Patch('/:id')
  // @UsePipes(ValidationPipe)
  updateTaskStatus(
    @Param('id') id: string, 
    @Body() updateTaskStatusDto: UpdateTaskStatusDto 
  ): Task {
    console.log(updateTaskStatusDto);
    
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }
  
}
