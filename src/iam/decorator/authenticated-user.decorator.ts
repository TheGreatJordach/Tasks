import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../authentication/constants/user.key";
import { AuthUserData } from "../authenticated-user-data.interface";

export const AuthicatedUser = createParamDecorator(
  (field: keyof AuthUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : null;
  }
);
