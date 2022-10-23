import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

export type AdminGroup = 'Admin';

@Injectable()
class AdminRolesGuardClass implements CanActivate {
  constructor(private role: AdminGroup, public userService?: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('request', request.user);
    const { user } = request;
    if (!user) return false;
    const groups = [user.role];
    return groups.includes(this.role);
  }
}

export const AdminRolesGuard = (role: AdminGroup) =>
  new AdminRolesGuardClass(role);
