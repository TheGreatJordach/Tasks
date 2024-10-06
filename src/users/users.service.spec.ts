import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";

describe("UsersService", () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("ifEmailUsed", () => {
    it("should return a user if the email is found", async () => {
      const mockUser = { id: 1, email: "test@example.com" } as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.ifEmailUsed("test@example.com");

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null if no user is found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await usersService.ifEmailUsed("notfound@example.com");

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: "notfound@example.com" },
      });
    });

    it("should log a warning if an error occurs and return null", async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, "warn");
      mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

      const result = await usersService.ifEmailUsed("error@example.com");

      expect(result).toBeNull();
      expect(loggerSpy).toHaveBeenCalledWith("Database error");
    });
  });

  describe("createUser", () => {
    it("should create and save a new user", async () => {
      const signUpDto: SignUpDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        tasks: [],
      };
      const encryptedPassword = "encryptedPassword123";
      const mockUser = { id: 1, ...signUpDto, password: encryptedPassword };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await usersService.createUser(
        signUpDto,
        encryptedPassword
      );

      expect(userRepository.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: encryptedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it("should not mutate the input DTO", async () => {
      const signUpDto: SignUpDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        tasks: [],
      };
      const encryptedPassword = "encryptedPassword123";
      const signUpDtoCopy = { ...signUpDto };

      mockUserRepository.create.mockReturnValue(signUpDto);
      mockUserRepository.save.mockResolvedValue(signUpDto);

      await usersService.createUser(signUpDto, encryptedPassword);

      // Ensure DTO has not been mutated
      expect(signUpDto).toEqual(signUpDtoCopy);
    });

    it("should handle duplicate email error (if applicable)", async () => {
      const signUpDto: SignUpDto = {
        email: "duplicate@example.com",
        password: "password123",
        name: "Test User",
        tasks: [],
      };
      const encryptedPassword = "encryptedPassword123";

      mockUserRepository.save.mockRejectedValue({
        code: "23505", // Unique constraint error code for PostgresSQL
        detail: "Duplicate email",
      });

      await expect(
        usersService.createUser(signUpDto, encryptedPassword)
      ).rejects.toThrow(InternalServerErrorException);
    });

    it("should throw an InternalServerErrorException if save fails", async () => {
      const signUpDto: SignUpDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        tasks: [],
      };
      const encryptedPassword = "encryptedPassword123";

      mockUserRepository.save.mockRejectedValue(new Error("Save error"));

      await expect(
        usersService.createUser(signUpDto, encryptedPassword)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
