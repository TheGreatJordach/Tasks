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
  Query,
  UnauthorizedException,
  UseInterceptors,
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
import { IdDto } from "../common/dto/id-dto";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { PaginationResultDto } from "../common/pagination/generic-pagination-result.dto";
import { Throttle } from "@nestjs/throttler";
import { TodoQueryDto } from "./dto/tast-query.dto";
import { CustomResponseInterceptor } from "../common/interceptors/custom-response.interceptor";

//@UseInterceptors(CustomResponseInterceptor)
@Throttle({ default: { limit: 3, ttl: 60000 } })
@Auth(AuthType.Bearer)
@Controller("todos")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("search")
  async searchTodos(
    @AuthenticateUser() userPayload: AuthUserData,
    @Query() query: TodoQueryDto
  ) {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const { limit, search } = query;
    return await this.taskService.searchTodos(search, limit);
  }

  /**
   * Retrieves and paginates all todos for a specific user.
   *
   * @param {AuthUserData} userPayload - The authenticated user's data.
   * @param {PaginationDto} paginationDto - The pagination details for the todos.
   * @returns {Promise<PaginationResultDto<Task>>} A promise that resolves to a paginated result of todos.
   * @throws {NotFoundException} If the user or tasks are not found.
   */
  @Get()
  async getAllTodos(
    @AuthenticateUser() userPayload: AuthUserData,
    @Query() paginationDto: PaginationDto
  ): Promise<PaginationResultDto<Task>> {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException(`Not found Task for Connected User`);
    }

    return await this.taskService.paginateTasksForUser(paginationDto, user);
  }

  /**
   * Retrieves user information and creates a new task associated with the user.
   *
   * @param {AuthUserData} userPayload - The authenticated user's data.
   * @param {CreateTodoDto} todo - The details of the task to be created.
   * @returns {Promise<Task>} A promise that resolves to the created task.
   * @throws {NotFoundException} If the user does not exist.
   */
  @UseInterceptors(CustomResponseInterceptor)
  @Post()
  async createTodo(
    @AuthenticateUser() userPayload: AuthUserData,
    @Body() todo: CreateTodoDto
  ): Promise<Task> {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    return await this.taskService.createTask(todo, user);
  }

  /**
   * Updates a task for a specific user.
   *
   * @param {AuthUserData} userPayload - The authenticated user's data.
   * @param {IdDto} id - The ID of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The data to update the task with.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   * @throws {NotFoundException} If the user does not exist.
   */
  @UseInterceptors(CustomResponseInterceptor)
  @Put(":id")
  async updateTodo(
    @AuthenticateUser() userPayload: AuthUserData,
    @Param() { id }: IdDto,
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

  /**
   * Deletes a todo for the authenticated user.
   *
   * @param {AuthUserData} userPayload - The authenticated user's data.
   * @param {IdDto} id - The ID of the todo to delete.
   * @returns {Promise<void>} A promise that resolves once the todo is deleted.
   * @throws {NotFoundException} If the user or todo is not found.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteTodo(
    @AuthenticateUser() userPayload: AuthUserData,
    @Param() { id }: IdDto
  ): Promise<void> {
    const user: User | null = await this.taskService.getUserEntity(
      userPayload.sub
    );
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    await this.taskService.deleteTask(id, user);
  }
}
