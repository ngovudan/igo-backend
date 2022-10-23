import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { Document, Schema as Schemas, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, index: true })
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  password: string;

  @Prop({ type: String })
  @ApiProperty()
  role: string;

  @Prop()
  @ApiProperty()
  enabled: boolean;

  @Prop()
  @ApiProperty({ default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ required: false })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ required: false })
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
