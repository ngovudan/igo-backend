import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SETTINGS } from 'src/app.utils';
// import { SETTINGS } from 'src/app.utils';
import { UserRegisterRequestDto } from './dto/user-register.req.dto';

// import { UserRegisterRequestDto } from './dto/user-register.req.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
}
