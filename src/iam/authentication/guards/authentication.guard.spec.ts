import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticationGuard } from "./authentication.guard";
import { AccessTokenGuard } from "./access-token.guard";
import { AuthType } from "../enum/auth-type.enum";

import { JwtService } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../../../app-config/jwt/jwt.config";

describe("AuthenticationGuard", () => {
  let guard: AuthenticationGuard;
  let reflector: Reflector;
  let accessTokenGuard: AccessTokenGuard;
  let jwtService: JwtService;
  let mockJwtConfig: ConfigType<typeof jwtConfig>;

  const mockExecutionContext = () => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  });

  beforeEach(async () => {
    // Create a mock JwtService
    jwtService = {
      verifyAsync: jest.fn(), // You can mock this as needed
    } as unknown as JwtService;

    // Create a mock JWT configuration
    mockJwtConfig = {
      // Add any specific properties that your config has
      secret: "test-secret",
      audience: "http://localhost:300",
      issuer: "http://localhost:300",
      accessTokenTtl: 3600,
    };

    // Create the AccessTokenGuard with mocked dependencies
    accessTokenGuard = new AccessTokenGuard(jwtService, mockJwtConfig);

    // Create the reflector instance
    reflector = new Reflector();

    // Instantiate the AuthenticationGuard with the mocked dependencies
    guard = new AuthenticationGuard(reflector, accessTokenGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if the Bearer token is valid", async () => {
    const context = mockExecutionContext();

    // Mock the reflector to return AuthType.Bearer
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AuthType.Bearer]);

    // Mock the AccessTokenGuard
    accessTokenGuard.canActivate = jest.fn().mockResolvedValue(true);

    const result = await guard.canActivate(
      context as unknown as ExecutionContext
    );

    expect(result).toBe(true);
    expect(accessTokenGuard.canActivate).toHaveBeenCalledWith(context);
  });

  it("should return true if the auth type is None", async () => {
    const context = mockExecutionContext();

    // Mock the reflector to return AuthType.None
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([AuthType.None]);

    const result = await guard.canActivate(
      context as unknown as ExecutionContext
    );

    expect(result).toBe(true);
  });

  it("should throw UnauthorizedException if all guards fail", async () => {
    const context = mockExecutionContext();
    const errors = new UnauthorizedException();

    // Mock the reflector to return AuthType.Bearer
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AuthType.Bearer]);

    // Mock the AccessTokenGuard to throw an error
    accessTokenGuard.canActivate = jest.fn().mockRejectedValue(errors);

    await expect(
      guard.canActivate(context as unknown as ExecutionContext)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if no auth types are defined", async () => {
    const context = mockExecutionContext();
    const errors = new UnauthorizedException();

    // Mock the reflector to return undefined
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);

    // Mock the AccessTokenGuard to throw an error
    accessTokenGuard.canActivate = jest.fn().mockRejectedValue(errors);

    await expect(
      guard.canActivate(context as unknown as ExecutionContext)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should log an error if an exception is thrown", async () => {
    const context = mockExecutionContext();
    const loggerSpy = jest.spyOn(guard["logger"], "log");
    const errors = new UnauthorizedException();

    // Mock the reflector to return AuthType.Bearer
    jest
      .spyOn(reflector, "getAllAndOverride")
      .mockReturnValue([AuthType.Bearer]);

    // Mock the AccessTokenGuard to throw an error
    accessTokenGuard.canActivate = jest.fn().mockRejectedValue(errors);

    await expect(
      guard.canActivate(context as unknown as ExecutionContext)
    ).rejects.toThrow(UnauthorizedException);
    expect(loggerSpy).toHaveBeenCalledWith(
      "Somme errors occurred while trying to use Auth guards",
      errors.cause
    );
  });
});
