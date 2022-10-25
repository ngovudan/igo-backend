import {
  Controller,
  Post,
  Body,
  ParseArrayPipe,
  Query,
  Get,
} from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { CreateConfigDto, GetManyConfigDto } from './dtos';

@Controller('')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post('bulk')
  public async createOrUpdateMany(
    @Body(new ParseArrayPipe({ items: CreateConfigDto })) createConfigDtoArray,
  ) {
    return this.configsService.createOrUpdateMany(createConfigDtoArray);
  }

  @Get('bulk')
  public async getMany(@Query() query: GetManyConfigDto) {
    return this.configsService.getMany(query.keys);
  }
}
