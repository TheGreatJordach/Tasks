import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(UnauthorizedException)
export class UnAuthorizeExceptionFilters implements ExceptionFilter {
  private readonly logger = new Logger("UnauthorizedException Filter");
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `[Exception] - Type: ${exception.message} - Status: ${status} - Location: ${request.url}`
    );

    response.status(HttpStatus.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
}
