import { TasksController } from './tasks.controller';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
