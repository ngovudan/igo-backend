import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Category } from 'core/schemas/category.schema';
import { AdminRolesGuard } from 'src/auth/admin-role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BaseListResponse } from 'src/common/dtos';
import { CategoriesService } from './categories.service';
import { ListCategoryDto } from './dtos';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard('Admin'))
@Controller('')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Category' })
  async create(@Body() createProductDto: Category): Promise<Category> {
    return this.categoriesService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List Categories' })
  list(@Query() options: ListCategoryDto): Promise<BaseListResponse<Category>> {
    return this.categoriesService.list(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a Category' })
  async get(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.get(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Category' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Category' })
  async delete(@Param('id') id: string): Promise<{ deletedCount: number }> {
    return this.categoriesService.remove(id);
  }
}
