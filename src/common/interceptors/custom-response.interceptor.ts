import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { plainToInstance } from "class-transformer";
import { PublicTodoDto } from "../dto/custom.dto";

export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(PublicTodoDto, data, {
          excludeExtraneousValues: true,
        });
      })
    );
  }
}
