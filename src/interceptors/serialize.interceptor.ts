import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) =>
        plainToClass(UserDto, data, {
          excludeExtraneousValues: true, // ONLY EXPOSE properties marked @Expose() inside the UserDto
          // Removes all other properties, such as passwords
        }),
      ),
    );
  }
}
