import { Task } from "../../tasks/entity/task.entity";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class BaseUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @Type(() => Task)
  @ValidateNested({ each: true })
  readonly tasks: Task[];
}
