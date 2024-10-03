import { IsInt, IsPositive } from "class-validator";

export class IdDto {
  @IsPositive()
  @IsInt()
  id: number;
}
