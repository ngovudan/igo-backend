import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ListCategoryDto {
  @ApiProperty()
  @IsOptional()
  parent?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  path?: string;
}
