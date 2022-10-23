import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators, Type as NestType } from '@nestjs/common';
import { Type } from 'class-transformer';

class Metadata {
  @ApiProperty()
  total?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  limit?: number;
}

export class BaseListResponse<TDocType> {
  @ApiProperty()
  docs: TDocType[];

  @ApiProperty({ type: Metadata })
  $metadata?: Metadata;
}

export class BaseListDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  // @IsNumber()
  page = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  // @IsNumber()
  limit = 20;
}
