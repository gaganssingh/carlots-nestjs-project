import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log(`Inside the AdminGuard`);

    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      console.log(`request.currentUser is NOT`);
      return false;
    }

    if (request.currentUser.admin) {
      console.log('request.currentUser.admin', request.currentUser.admin);
      return true;
    } else {
      return false;
    }
    // return request.currentUser.admin
  }
}
