import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    // Locate the user's id from the request
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      // If user is present on the session obj in the request
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    // If no user id present on the session obj
    // Just run the request handler as is
    return handler.handle();
  }
}
