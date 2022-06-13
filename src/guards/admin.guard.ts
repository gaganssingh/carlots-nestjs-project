import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log(`Inside the AdminGuard`);

    const request = context.switchToHttp().getRequest();
    console.log('request.currentUser', request.currentUser);
    console.log('request', request);
    if (!request.currentuser) {
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
