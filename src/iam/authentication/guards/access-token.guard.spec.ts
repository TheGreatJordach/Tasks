import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AccessTokenGuard } from "./access-token.guard"; // Adjust the import path as necessary
import jwtConfig from "../../../app-config/jwt/jwt.config";
import { REQUEST_USER_KEY } from "../constants/user.key";

describe("AccessTokenGuard", () => {
  let guard: AccessTokenGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockExecutionContext = () => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: "Bearer valid_token",
        },
      }),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: jwtConfig.KEY, useValue: { secret: "test_secret" } }, // Mock your jwtConfig if necessary
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("canActivate", () => {
    it("should return true if the token is valid", async () => {
      const context = mockExecutionContext();
      const decodedToken = { userId: 1, username: "testUser" };

      // Mocking the verifyAsync method to resolve with the decoded token
      jwtService.verifyAsync = jest.fn().mockResolvedValue(decodedToken);

      const result = await guard.canActivate(
        context as unknown as ExecutionContext
      );

      expect(result).toBe(true);
      // Check that the decoded token is stored in the correct property
      expect(context.switchToHttp().getRequest()[REQUEST_USER_KEY]).toEqual(
        decodedToken
      );
    });

    it("should throw UnauthorizedException if no token is provided", async () => {
      const context = mockExecutionContext();
      context.switchToHttp().getRequest().headers.authorization = undefined;

      await expect(
        guard.canActivate(context as unknown as ExecutionContext)
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if the token is invalid", async () => {
      const context = mockExecutionContext();
      jwtService.verifyAsync = jest
        .fn()
        .mockRejectedValue(new Error("Invalid token"));

      await expect(
        guard.canActivate(context as unknown as ExecutionContext)
      ).rejects.toThrow(UnauthorizedException);
    });
    it("should not throw an exception if the token is valid", async () => {
      const context = mockExecutionContext();
      const decodedToken = { userId: 1, username: "testUser" };

      jwtService.verifyAsync = jest.fn().mockResolvedValue(decodedToken);

      await expect(
        guard.canActivate(context as unknown as ExecutionContext)
      ).resolves.not.toThrow();
    });
    it("should throw UnauthorizedException if jwtService.verifyAsync fails", async () => {
      const context = mockExecutionContext();
      jwtService.verifyAsync = jest
        .fn()
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        guard.canActivate(context as unknown as ExecutionContext)
      ).rejects.toThrow(UnauthorizedException);
    });
    it("should call jwtService.verifyAsync with the correct token", async () => {
      const context = mockExecutionContext();
      const decodedToken = { userId: 1, username: "testUser" };
      jwtService.verifyAsync = jest.fn().mockResolvedValue(decodedToken);

      await guard.canActivate(context as unknown as ExecutionContext);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        "valid_token",
        expect.any(Object)
      );
    });
    it("should log a warning when the token is not found", async () => {
      const context = mockExecutionContext();
      context.switchToHttp().getRequest().headers.authorization = undefined;

      const loggerSpy = jest.spyOn(guard["logger"], "warn");
      await expect(
        guard.canActivate(context as unknown as ExecutionContext)
      ).rejects.toThrow(UnauthorizedException);
      expect(loggerSpy).toHaveBeenCalledWith(" Bad Token found in the Header");
    });
  });
});
