import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) { }

  async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = getTasksFilterDto;
    const query = this.taskRepo.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

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
    const newStatus = status.toUpperCase();
    console.log(newStatus);

    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepo.save(task);
    return task;
  }

  async deleteTask(id: number){
    const result = await this.taskRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task wint ID "${id}" not found`);
    }

    return 'Deleted successfully.';
  }
}
