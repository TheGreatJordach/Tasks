import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Auth } from "../iam/authentication/decorators/auth.decorators";
import { AuthType } from "../iam/authentication/enum/auth-type.enum";
import { TaskService } from "./task.service";
import { AuthenticateUser } from "../iam/decorator/authenticated-user.decorator";
import { AuthUserData } from "../iam/authenticated-user-data.interface";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { User } from "../users/entity/user.entity";
import { Task } from "./entity/task.entity";
import { UpdateTaskDto } from "./dto/update-todo.dto";

@Auth(AuthType.Bearer)
@Controller("todos")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async getTodos(
    @AuthenticateUser() userPayload: AuthUserData,
    @Body() todo: CreateTodoDto
  ) {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    return await this.taskService.createTask(todo, user);
  }

  @Put(":id")
  async updateTodo(
    @AuthenticateUser() userPayload: AuthUserData,
    @Param("id") id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    return await this.taskService.updateTask(id, updateTaskDto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteTodo(
    @AuthenticateUser() userPayload: AuthUserData,
    @Param("id") id: number
  ) {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    await this.taskService.deleteTask(id, user);
  }

  @Get()
  async getAllTodos(
    @AuthenticateUser() userPayload: AuthUserData
  ): Promise<Task[]> {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException(`Not found Task for ${user.name}`);
    }

    return await this.taskService.getAllTasksForUser(user);
  }
}
