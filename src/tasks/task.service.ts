import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entity/task.entity";
import { Repository } from "typeorm";
import { User } from "../users/entity/user.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTaskDto } from "./dto/update-todo.dto";
import { PaginationResultDto } from "../common/pagination/generic-pagination-result.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";

@Injectable()
export class TaskService {
  private readonly logger = new Logger("TaskService");
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  /**
   * Paginates tasks for a specific user based on the provided pagination details.
   *
   * @param {PaginationDto} paginationDto - The pagination details including page and limit.
   * @param {User} user - The user for whom tasks are being paginated.
   * @returns {PaginationResultDto<Task>} A paginated result containing tasks for the user.
   * @throws {InternalServerErrorException} If an error occurs during the pagination process.
   */
  async paginateTasksForUser(
    paginationDto: PaginationDto,
    user: User
  ): Promise<PaginationResultDto<Task>> {
    const { page, limit } = paginationDto;

    try {
      const [data, totalCount] = await this.taskRepository.findAndCount({
        where: { user },
        skip: (page - 1) * limit,
        take: limit,
        order: { createAt: "DESC" },
      });

      const totalPages = Math.ceil(totalCount / limit);
      return new PaginationResultDto<Task>({
        data,
        page,
        limit,
        totalCount,
        totalPages,
        nextPage: page < totalPages,
        previousPage: page > 1,
      });
    } catch (error) {
      this.logger.error("Failed to getAllTasks", error);
      this.logger.error(`Error code : ${error.code}`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Asynchronously creates a new task and saves it to the repository.
   *
   * @param {CreateTodoDto} todo - The data transfer object containing the details of the task to be created.
   * @param {User} user - The user who is creating the task.
   * @returns {Promise<Task>} A promise that resolves to the created task.
   * @throws {InternalServerErrorException} If there is an error during the task creation process.
   *
   * This function attempts to create a new task using the provided `todo` details and associates it with the specified `user`.
   * It then saves the task to the repository. If an error occurs during this process, it logs the error and throws an
   * `InternalServerErrorException`.
   */
  async createTask(todo: CreateTodoDto, user: User): Promise<Task> {
    try {
      const task = this.taskRepository.create({ ...todo, user });
      return await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error("Failed to create task", error);
      this.logger.error(`Code Error, ${error.code}`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Retrieves a user entity based on the provided user ID.
   *
   * @param {number} userID - The ID of the user to retrieve.
   * @returns {Promise<User | null>} A promise that resolves to the user entity if found, otherwise null.
   */
  async getUserEntity(userID: number): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ id: userID });
    } catch (error) {
      this.logger.log("Failed to get user entity", error);
      return null;
    }
  }

  /**
   * Updates a task in the repository based on the provided task ID, update data, and user.
   *
   * @param {number} taskID - The ID of the task to update.
   * @param {UpdateTaskDto} updateTaskDto - The data to update the task with.
   * @param {User} user - The user performing the update.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   * @throws {NotFoundException} If the task with the specified ID is not found.
   * @throws {InternalServerErrorException} If there is an error during the update process.
   */
  async updateTask(
    taskID: number,
    updateTaskDto: UpdateTaskDto,
    user: User
  ): Promise<Task> {
    const updatedTask = await this.taskRepository.preload({
      id: taskID,
      ...updateTaskDto,
      user,
    });

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${taskID} not found`);
    }

    try {
      return await this.taskRepository.save(updatedTask);
    } catch (error) {
      this.logger.error("Failed to update task", error.message);
      this.logger.error(`Error code ${error.code}`);
      throw new InternalServerErrorException("Failed to update task");
    }
  }

  /**
   * Deletes a task based on the task ID and user.
   *
   * @param {number} taskID - The ID of the task to be deleted.
   * @param {User} user - The user requesting the task deletion.
   * @returns {Promise<void>} A promise that resolves once the task is deleted.
   * @throws {NotFoundException} If the task with the specified ID is not found for the user.
   */
  async deleteTask(taskID: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({
      id: taskID,
      user: user,
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskID} not found for the user`
      );
    }

    const result = await this.taskRepository.delete(taskID);
    if (result.affected) {
      this.logger.log(`Task with ID ${taskID} deleted by User ID ${user.name}`);
    }
  }
}
