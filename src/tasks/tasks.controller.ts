import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]>  {
    return this.tasksService.getTasks(filterDto);
  }


  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }


  @Post('/')
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }


  @Patch('/:id')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status);
  }


  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number){
    return this.tasksService.deleteTask(id);
  }

}
