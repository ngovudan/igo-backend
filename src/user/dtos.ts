import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAndUpdateUserDto {
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false, default: true })
  enabled?: boolean = true;
}

export enum ActionBulkUser {
  Delete = 'delete',
  Update = 'update',
}
