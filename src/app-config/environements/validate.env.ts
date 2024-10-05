import { plainToInstance } from "class-transformer";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  validateSync,
} from "class-validator";

export class ValidateEnv {
  @IsNotEmpty()
  @IsString()
  DATASOURCE_USERNAME: string;
  @IsNotEmpty()
  @IsString()
  DATASOURCE_PASSWORD: string;
  @IsNotEmpty()
  @IsString()
  DATASOURCE_DATABASE: string;
  @IsNotEmpty()
  @IsString()
  DATASOURCE_HOST: string;

  @IsNumber()
  @IsPositive()
  DATASOURCE_PORT: number;
  @IsNumber()
  @IsPositive()
  APP_PORT: number;
  @IsNumber()
  @IsPositive()
  SALT_ROUND: number;
  @IsNotEmpty()
  @IsString()
  APP_PREFIX: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
  @IsNotEmpty()
  @IsString()
  JWT_TOKEN_AUDIENCE: string;
  @IsNotEmpty()
  @IsString()
  JWT_TOKEN_ISSUER: string;
  @IsNumber()
  @IsPositive()
  JWT_TOKEN_TTL: number;
  @IsNumber()
  @IsPositive()
  THROTTLER_TTL: number;
  @IsNumber()
  @IsPositive()
  THROTTLER_LIMIT: number;
}

export function validateEnv(options: Record<string, unknown>) {
  const logger = new Logger("Validate Env");
  const validatedEnv = plainToInstance(ValidateEnv, options, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedEnv, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    logger.log(`${errors.length} are missing proper validation `);
    logger.debug(`${errors.toString()}`);
    throw new InternalServerErrorException("Validation Error");
  }
  logger.log("All Env. validation results are successfully");
  return validatedEnv;
}
