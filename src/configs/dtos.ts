import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateConfigDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsOptional()
  value: any;
}

export class GetManyConfigDto {
  @ApiProperty()
  @IsArray()
  keys: string[];
}
