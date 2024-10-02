import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccessTokenGuard } from "./access-token.guard";
import { AuthType } from "../enum/auth-type.enum";
import { AUTH_TYPE_KEY } from "../decorators/auth.decorators";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger("AuthenticationGuard");

  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    ) ?? [AuthenticationGuard.defaultAuthType];

    console.log("Retrieved auth types:", authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let errors = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch((err) => {
        errors = err;
      });

      if (canActivate) {
        return true;
      }
    }
    this.logger.log(
      "Somme errors occurred while trying to use Auth guards",
      errors.cause
    );
    throw errors;
  }
}
