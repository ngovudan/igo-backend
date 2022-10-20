import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/user/enums/user.enum';
import { UserService } from '../user/user.service';

// @Injectable()
// export class AdminRoleGuard implements CanActivate {
//   constructor(private userService: UserService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();

// if (request?.user) {
//   const { id } = request.user;
//   const user = await this.userService.getUserById(id);
//   return user.role === UserRoles.ADMIN;
// }

// return false;
//   }
// }

export type AdminGroup = 'Admin';

@Injectable()
class AdminRolesGuardClass implements CanActivate {
  constructor(private role: AdminGroup, private userService?: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.getUserById(id);
      const groups = user['roles'];

      if (!Array.isArray(groups)) return false;

      return groups.includes(this.role);
    }
    return false;
  }
}

export const AdminRolesGuard = (role: AdminGroup) =>
  new AdminRolesGuardClass(role);
