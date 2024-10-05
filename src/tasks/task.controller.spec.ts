import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { AuthUserData } from "../iam/authenticated-user-data.interface";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTaskDto } from "./dto/update-todo.dto";
import { IdDto } from "../common/dto/id-dto";
import { User } from "../users/entity/user.entity";
import { Task } from "./entity/task.entity";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { PaginationResultDto } from "../common/pagination/generic-pagination-result.dto";
import { NotFoundException } from "@nestjs/common";

describe("TaskController", () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(() => {
    taskService = {
      getUserEntity: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      paginateTasksForUser: jest.fn(),
    } as unknown as TaskService;

    taskController = new TaskController(taskService);
  });

  const mockUser: Partial<User> = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };

  const mockTask: Partial<Task> = {
    id: 1,
    title: "Test Task",
    description: "Test Desc",
    user: mockUser as User,
  };

  const mockPaginationResult: PaginationResultDto<Task> = {
    data: [mockTask as Task],
    totalCount: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    nextPage: null,
    previousPage: null,
  };

  describe("getTodos", () => {
    it("should create and return a task", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(mockUser);
      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskController.getTodos(
        { sub: 1 } as AuthUserData,
        { title: "New Task", description: "Test Desc" } as CreateTodoDto
      );

      expect(taskService.getUserEntity).toHaveBeenCalledWith(1);
      expect(taskService.createTask).toHaveBeenCalledWith(
        { title: "New Task", description: "Test Desc" },
        mockUser
      );
      expect(result).toEqual(mockTask);
    });

    it("should throw NotFoundException if user does not exist", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(null);

      await expect(
        taskController.getTodos(
          { sub: 1 } as AuthUserData,
          { title: "New Task", description: "Test Desc" } as CreateTodoDto
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateTodo", () => {
    it("should update and return the task", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(mockUser);
      (taskService.updateTask as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskController.updateTodo(
        { sub: 1 } as AuthUserData,
        { id: 1 } as IdDto,
        { title: "Updated Task", description: "Updated Desc" } as UpdateTaskDto
      );

      expect(taskService.getUserEntity).toHaveBeenCalledWith(1);
      expect(taskService.updateTask).toHaveBeenCalledWith(
        1,
        { title: "Updated Task", description: "Updated Desc" },
        mockUser
      );
      expect(result).toEqual(mockTask);
    });

    it("should throw NotFoundException if user does not exist", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(null);

      await expect(
        taskController.updateTodo(
          { sub: 1 } as AuthUserData,
          { id: 1 } as IdDto,
          {
            title: "Updated Task",
            description: "Updated Desc",
          } as UpdateTaskDto
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deleteTodo", () => {
    it("should delete the task and return void", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(mockUser);

      await taskController.deleteTodo(
        { sub: 1 } as AuthUserData,
        { id: 1 } as IdDto
      );

      expect(taskService.getUserEntity).toHaveBeenCalledWith(1);
      expect(taskService.deleteTask).toHaveBeenCalledWith(1, mockUser);
    });

    it("should throw NotFoundException if user does not exist", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(null);

      await expect(
        taskController.deleteTodo(
          { sub: 1 } as AuthUserData,
          { id: 1 } as IdDto
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("getAllTodos", () => {
    it("should return paginated tasks", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(mockUser);
      (taskService.paginateTasksForUser as jest.Mock).mockResolvedValue(
        mockPaginationResult
      );

      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const result = await taskController.getAllTodos(
        { sub: 1 } as AuthUserData,
        paginationDto
      );

      expect(taskService.getUserEntity).toHaveBeenCalledWith(1);
      expect(taskService.paginateTasksForUser).toHaveBeenCalledWith(
        paginationDto,
        mockUser
      );
      expect(result).toEqual(mockPaginationResult);
    });

    it("should throw NotFoundException if user does not exist", async () => {
      (taskService.getUserEntity as jest.Mock).mockResolvedValue(null);

      await expect(
        taskController.getAllTodos(
          { sub: 1 } as AuthUserData,
          { page: 1, limit: 10 } as PaginationDto
        )
      ).rejects.toThrow(NotFoundException);
    });
  });
});
