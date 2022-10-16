import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { randomUUID } from 'crypto';
import { BaseEntity, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) { }
  // private tasks: Task[] = [];

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = getTasksFilterDto;
    const query = this.taskRepo.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status',{ status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)',{search:`%${search}%`});
    }

    const tasks = await query.getMany()
    return tasks;
  }
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task =>
  //         task.title.includes(search) ||
  //         task.description.includes(search)
  //     );
  //   }

  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepo.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task wint ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });

    return this.taskRepo.save(task);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const newStatus = status.toUpperCase()
    console.log(newStatus);

    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepo.save(task);
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);

    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task wint ID "${id}" not found`);
    }
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);

  //   if(!found){
  //     throw new NotFoundException(`Task with ID "${id}" not found.`);
  //   }

  //   return found;
  // }

  // const { title, description } = createTaskDto;
  // const task = new Task();
  // task.title = title;
  // task.description = description;
  // task.status = TaskStatus.OPEN;
  // await task.save();
  // return task;

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: randomUUID(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }


  // updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
  //   const { status } = updateTaskStatusDto
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
