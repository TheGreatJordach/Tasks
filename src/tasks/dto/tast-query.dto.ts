import { IsIn, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class TodoQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // search by description ot title
  @IsOptional()
  @Type(() => Number)
  limit?: number; // Pagination limit
  @IsOptional()
  @Type(() => Number)
  page?: number;
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortBy?: "title" | "description"; // Sorting field
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortDirection?: "ASC" | "DESC"; // Sorting field
}
