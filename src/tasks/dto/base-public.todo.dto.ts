import { IsNotEmpty, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";
import { PublicUserDto } from "../../users/dto/public-user.dto";

export class BasePublicTodoDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @Expose()
  @Type(() => PublicUserDto)
  readonly user: PublicUserDto;
}
