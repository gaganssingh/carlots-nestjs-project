import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// CUSTOM DECORATOR
export const Serialize = (dto: any) =>
  UseInterceptors(new SerializeInterceptor(dto));

// INTERCEPTOR
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) =>
        plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // ONLY EXPOSE properties marked @Expose() inside the UserDto
          // Removes all other properties, such as passwords
        }),
      ),
    );
  }
}
