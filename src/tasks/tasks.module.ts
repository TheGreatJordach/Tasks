import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entity/task.entity";
import { User } from "../users/entity/user.entity";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { SearchModule } from "../search/search.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([User]),
    SearchModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}
