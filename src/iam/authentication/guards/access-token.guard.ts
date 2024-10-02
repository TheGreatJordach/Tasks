import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../../../app-config/jwt/jwt.config";
import { ConfigType } from "@nestjs/config";
import { Request } from "Express";
import { REQUEST_USER_KEY } from "../constants/user.key";

/**
 * Guard that checks the validity of an access token.
 * If the token is valid, it adds the user information to the request object.
 * If the token is invalid, it throws an UnauthorizedException.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger: Logger = new Logger("AccessTokenGuard");

  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.warn(" Bad Token found in the Header");
      throw new UnauthorizedException();
    }
    try {
      //export const REQUEST_USER_KEY = "user";
      request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the token from the authorization header of the request.
   * @param request - The request object containing headers.
   * @returns The extracted token string or undefined if not found.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(" ") ?? [];
    return token;
  }
}
