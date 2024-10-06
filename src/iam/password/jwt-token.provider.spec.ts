import { Test, TestingModule } from "@nestjs/testing";

import { JwtService } from "@nestjs/jwt";
import { InternalServerErrorException, Logger } from "@nestjs/common";

import { ConfigType } from "@nestjs/config";
import jwtConfig from "../../app-config/jwt/jwt.config";
import { JwtTokenProvider } from "../jwt-token.provider";
import { User } from "../../users/entity/user.entity";

describe("JwtTokenProvider", () => {
  let jwtTokenProvider: JwtTokenProvider;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    audience: "test-audience",
    issuer: "http://localhost:300",
    secret: "test-secret",
    accessTokenTtl: 3600,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenProvider,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    jwtTokenProvider = module.get<JwtTokenProvider>(JwtTokenProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate a JWT token successfully", async () => {
      const user: User = { id: 1, email: "test@example.com" } as User; // Mock User object

      const expectedToken = "generated-token";
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await jwtTokenProvider.generateToken(user);

      expect(result).toEqual({ token: expectedToken });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: user.id,
          email: user.email,
        },
        {
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          secret: mockJwtConfig.secret,
          expiresIn: mockJwtConfig.accessTokenTtl,
        }
      );
    });

    it("should throw InternalServerErrorException if token generation fails", async () => {
      const user: User = { id: 1, email: "test@example.com" } as User; // Mock User object

      mockJwtService.signAsync.mockRejectedValue(
        new Error("Token generation error")
      );

      await expect(jwtTokenProvider.generateToken(user)).rejects.toThrow(
        InternalServerErrorException
      );
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });

    it("should generate a valid JWT token with different user", async () => {
      const user: User = { id: 2, email: "another@example.com" } as User; // Different Mock User object

      const expectedToken = "another-generated-token";
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await jwtTokenProvider.generateToken(user);

      expect(result).toEqual({ token: expectedToken });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: user.id,
          email: user.email,
        },
        {
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          secret: mockJwtConfig.secret,
          expiresIn: mockJwtConfig.accessTokenTtl,
        }
      );
    });

    it("should throw an InternalServerErrorException with no user provided", async () => {
      await expect(jwtTokenProvider.generateToken(null as any)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
