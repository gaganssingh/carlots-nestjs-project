import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // Check if a current user exists
    // on the request body's session
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
