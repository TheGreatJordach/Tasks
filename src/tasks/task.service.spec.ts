import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskService } from "./task.service";
import { Task } from "./entity/task.entity";
import { User } from "../users/entity/user.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTaskDto } from "./dto/update-todo.dto";
import { PaginationDto } from "../common/pagination/pagination.dto";
import { PaginationResultDto } from "../common/pagination/generic-pagination-result.dto";

describe("TaskService", () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("paginateTasksForUser", () => {
    it("should return paginated tasks for a user", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockTasks = [new Task()];
      const totalCount = 1;

      (taskRepository.findAndCount as jest.Mock).mockResolvedValue([
        mockTasks,
        totalCount,
      ]);

      const result = await taskService.paginateTasksForUser(
        paginationDto,
        mockUser
      );

      expect(taskRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: mockUser },
        skip: 0,
        take: 10,
        order: { createAt: "DESC" },
      });
      expect(result).toEqual(
        new PaginationResultDto<Task>({
          data: mockTasks,
          totalCount,
          page: 1,
          limit: 10,
          totalPages: 1,
          nextPage: false,
          previousPage: false,
        })
      );
    });

    it("should throw InternalServerErrorException if error occurs", async () => {
      const mockUser = new User();
      mockUser.id = 1;
      const paginationDto: PaginationDto = { page: 1, limit: 10 };

      (taskRepository.findAndCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        taskService.paginateTasksForUser(paginationDto, mockUser)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("createTask", () => {
    it("should create and return a new task", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const createTodoDto: CreateTodoDto = {
        title: "Test Task",
        description: "Test Description",
        user: mockUser,
      };
      const mockTask = new Task();
      mockTask.id = 1;
      mockTask.title = createTodoDto.title;
      mockTask.description = createTodoDto.description;
      mockTask.user = mockUser;

      (taskRepository.create as jest.Mock).mockReturnValue(mockTask);
      (taskRepository.save as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(createTodoDto, mockUser);

      expect(taskRepository.create).toHaveBeenCalledWith({
        ...createTodoDto,
        user: mockUser,
      });
      expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });

    it("should throw InternalServerErrorException if error occurs", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const createTodoDto: CreateTodoDto = {
        title: "Test Task",
        description: "Test Description",
        user: mockUser,
      };

      (taskRepository.create as jest.Mock).mockReturnValue({});
      (taskRepository.save as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        taskService.createTask(createTodoDto, mockUser)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("getUserEntity", () => {
    it("should return user if found", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await taskService.getUserEntity(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await taskService.getUserEntity(1);
      expect(result).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("should update and return the task", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const updateTaskDto: UpdateTaskDto = {
        title: "Updated Task",
        description: "Updated Description",
      };
      const mockTask = new Task();
      mockTask.id = 1;
      mockTask.title = updateTaskDto.title;
      mockTask.description = updateTaskDto.description;
      mockTask.user = mockUser;

      (taskRepository.preload as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.save as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.updateTask(1, updateTaskDto, mockUser);

      expect(taskRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateTaskDto,
        user: mockUser,
      });
      expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });

    it("should throw NotFoundException if task not found", async () => {
      const mockUser = new User();
      mockUser.id = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: "Updated Task",
        description: "Updated Description",
      };

      (taskRepository.preload as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateTask(1, updateTaskDto, mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw InternalServerErrorException if error occurs", async () => {
      const mockUser = new User();
      mockUser.id = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: "Updated Task",
        description: "Updated Description",
      };
      const mockTask = new Task();
      mockTask.id = 1;

      (taskRepository.preload as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.save as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        taskService.updateTask(1, updateTaskDto, mockUser)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe("deleteTask", () => {
    it("should delete the task if found", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockTask = new Task();
      mockTask.id = 1;
      mockTask.user = mockUser;

      (taskRepository.findOneBy as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await taskService.deleteTask(1, mockUser);

      expect(taskRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        user: mockUser,
      });
      expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException if task not found", async () => {
      const mockUser = new User();
      mockUser.id = 1;

      (taskRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
