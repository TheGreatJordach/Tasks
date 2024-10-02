import { BaseUserDto } from "./base-user.dto";
import { IsStrongPassword } from "class-validator";

export class SignUpDto extends BaseUserDto {
  @IsStrongPassword()
  readonly password: string;
}
