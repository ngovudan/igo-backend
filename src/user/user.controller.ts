import { Body, Controller, Get, Post, Query, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'core/schemas/user.schema';
import { BaseListDto } from 'src/common/dtos';
import { ActionBulkUser, CreateAndUpdateUserDto } from './dtos';

import { UserService } from './user.service';

@ApiTags('User')
@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  async listUsers(@Query() query: BaseListDto): Promise<any> {
    return this.userService.listUsers(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async createUser(
    @Body() createUserDto: CreateAndUpdateUserDto,
  ): Promise<User> {
    console.log('createUserDto', createUserDto);

    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user' })
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateAndUpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Disable/Enable/Delete users' })
  @ApiOkResponse({ description: 'Success' })
  async bulk(@Body() body: any): Promise<string> {
    let result = null;
    switch (body.action) {
      case ActionBulkUser.Update:
        result = await this.userService.updateBulk(body);
        break;
      case ActionBulkUser.Delete:
        result = await this.userService.deleteBulk(body);
        break;
      default:
        break;
    }
    return result;
  }
}
