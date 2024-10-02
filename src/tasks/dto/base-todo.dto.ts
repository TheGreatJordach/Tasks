import { User } from "../../users/entity/user.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { Type } from "class-transformer";

export class BaseTodoDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @Type(() => User)
  readonly user: User;
}
