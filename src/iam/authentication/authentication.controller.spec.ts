import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationController } from "./authentication.controller";
import { IamService } from "../iam.service";
import { SignUpDto } from "../../users/dto/sign-up.dto";
import { LogInDto } from "../../users/dto/log-in.dto";
import { ConflictException, UnauthorizedException } from "@nestjs/common";

describe("AuthenticationController", () => {
  let authenticationController: AuthenticationController;
  let iamService: IamService;

  const mockIamService = {
    registration: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: IamService,
          useValue: mockIamService,
        },
      ],
    }).compile();

    authenticationController = module.get<AuthenticationController>(
      AuthenticationController
    );
    iamService = module.get<IamService>(IamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registration", () => {
    it("should successfully register a user and return a token", async () => {
      const signUpDto: SignUpDto = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        tasks: [],
      };
      const token = "some-jwt-token";
      mockIamService.registration.mockResolvedValue({ token });

      const result = await authenticationController.registration(signUpDto);
      expect(result).toEqual({ token });
      expect(mockIamService.registration).toHaveBeenCalledWith(signUpDto);
    });

    it("should throw ConflictException if registration fails due to email conflict", async () => {
      const signUpDto: SignUpDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        tasks: [],
      };
      mockIamService.registration.mockRejectedValue(new ConflictException());

      await expect(
        authenticationController.registration(signUpDto)
      ).rejects.toThrow(ConflictException);
      expect(mockIamService.registration).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe("login", () => {
    it("should successfully log in a user and return a token", async () => {
      const logInDto: LogInDto = {
        email: "test@example.com",
        password: "password123",
      };
      const token = "some-jwt-token";
      mockIamService.login.mockResolvedValue({ token });

      const result = await authenticationController.login(logInDto);
      expect(result).toEqual({ token });
      expect(mockIamService.login).toHaveBeenCalledWith(logInDto);
    });

    it("should throw UnauthorizedException if login fails due to invalid credentials", async () => {
      const logInDto: LogInDto = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      mockIamService.login.mockRejectedValue(new UnauthorizedException());

      await expect(authenticationController.login(logInDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockIamService.login).toHaveBeenCalledWith(logInDto);
    });
  });
});
