import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AdminRolesGuard } from './auth/admin-role.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, AdminRolesGuard('Admin'))
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
