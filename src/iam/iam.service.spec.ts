import { Test, TestingModule } from "@nestjs/testing";
import { IamService } from "./iam.service";
import { UsersService } from "../users/users.service";
import { PasswordService } from "./password/password.service";
import { JwtTokenProvider } from "./jwt-token.provider";
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignUpDto } from "../users/dto/sign-up.dto";
import { LogInDto } from "../users/dto/log-in.dto";
import { User } from "../users/entity/user.entity";

describe("IamService", () => {
  let iamService: IamService;
  let usersService: UsersService;
  let passwordService: PasswordService;
  let jwtTokenProvider: JwtTokenProvider;

  const mockUser: Partial<User> = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };

  const mockUserService = {
    ifEmailUsed: jest.fn(),
    createUser: jest.fn(),
  };

  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "this is for test",
    user: mockUser as User,
  };
  const mockPasswordService = {
    hasPassword: jest.fn(),
    comparePassword: jest.fn(),
  };

  const mockJwtTokenProvider = {
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtTokenProvider,
          useValue: mockJwtTokenProvider,
        },
      ],
    }).compile();

    iamService = module.get<IamService>(IamService);
    usersService = module.get<UsersService>(UsersService);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtTokenProvider = module.get<JwtTokenProvider>(JwtTokenProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registration", () => {
    it("should throw ConflictException if email is already in use", async () => {
      const signUpDto: SignUpDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        tasks: [],
      };
      mockUserService.ifEmailUsed.mockResolvedValue(true); // Simulate email in use

      await expect(iamService.registration(signUpDto)).rejects.toThrow(
        ConflictException
      );
      expect(usersService.ifEmailUsed).toHaveBeenCalledWith(signUpDto.email);
    });

    it("should throw InternalServerErrorException if hashing password fails", async () => {
      const signUpDto: SignUpDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        tasks: [],
      };
      mockUserService.ifEmailUsed.mockResolvedValue(false);
      mockPasswordService.hasPassword.mockResolvedValue(null); // Simulate hashing failure

      await expect(iamService.registration(signUpDto)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(mockPasswordService.hasPassword).toHaveBeenCalledWith(
        signUpDto.password
      );
    });

    it("should throw InternalServerErrorException if saving user fails", async () => {
      const signUpDto: SignUpDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        tasks: [],
      };
      const hashedPassword = "hashedPassword";
      mockUserService.ifEmailUsed.mockResolvedValue(false);
      mockPasswordService.hasPassword.mockResolvedValue(hashedPassword);
      mockUserService.createUser.mockResolvedValue(null); // Simulate saving failure

      await expect(iamService.registration(signUpDto)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        signUpDto,
        hashedPassword
      );
    });

    it("should return a token when registration is successful", async () => {
      const signUpDto: SignUpDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        tasks: [],
      };
      const hashedPassword = "hashedPassword";
      const savedUser = {
        id: 1,
        email: signUpDto.email,
        password: hashedPassword,
      };
      const token = "token";

      mockUserService.ifEmailUsed.mockResolvedValue(false);
      mockPasswordService.hasPassword.mockResolvedValue(hashedPassword);
      mockUserService.createUser.mockResolvedValue(savedUser);
      mockJwtTokenProvider.generateToken.mockResolvedValue({ token });

      const result = await iamService.registration(signUpDto);
      expect(result).toEqual({ token });
      expect(mockJwtTokenProvider.generateToken).toHaveBeenCalledWith(
        savedUser
      );
    });
  });

  describe("login", () => {
    it("should throw UnauthorizedException if email is not found", async () => {
      const logInDto: LogInDto = {
        email: "nonexistent@example.com",
        password: "password123",
      };
      mockUserService.ifEmailUsed.mockResolvedValue(null); // Simulate email not found

      await expect(iamService.login(logInDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(usersService.ifEmailUsed).toHaveBeenCalledWith(logInDto.email);
    });

    it("should throw UnauthorizedException if passwords do not match", async () => {
      const logInDto: LogInDto = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const storedUser = {
        id: 1,
        email: logInDto.email,
        password: "hashedPassword",
      };
      mockUserService.ifEmailUsed.mockResolvedValue(storedUser); // Simulate email found
      mockPasswordService.comparePassword.mockResolvedValue(false); // Simulate password mismatch

      await expect(iamService.login(logInDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        logInDto.password,
        storedUser.password
      );
    });

    it("should return a token when login is successful", async () => {
      const logInDto: LogInDto = {
        email: "test@example.com",
        password: "password123",
      };
      const storedUser = {
        id: 1,
        email: logInDto.email,
        password: "hashedPassword",
      };
      const token = "token";

      mockUserService.ifEmailUsed.mockResolvedValue(storedUser); // Simulate email found
      mockPasswordService.comparePassword.mockResolvedValue(true); // Simulate password match
      mockJwtTokenProvider.generateToken.mockResolvedValue({ token });

      const result = await iamService.login(logInDto);
      expect(result).toEqual({ token });
      expect(mockJwtTokenProvider.generateToken).toHaveBeenCalledWith(
        storedUser
      );
    });
  });
});
