import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from './../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async currentUser(@Request() req: any) {
    return this.userService.getUserById(req.user.id);
  }

  @Post('login')
  async login(@Body() loginDto: any): Promise<any> {
    return this.authService.generateToken(loginDto);
  }
}
