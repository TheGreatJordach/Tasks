import { IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = 1; //default page
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number = 10; //default limit per page
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsString()
  order?: "ASC" | "DESC" = "ASC";
}
