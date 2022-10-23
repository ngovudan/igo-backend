import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { RedisKey } from 'core/types';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop({ unique: true, index: true, enum: Object.values(RedisKey) })
  key: string;
  @Prop({ type: SchemaTypes.Mixed })
  value: any;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

const ConfigSchema = SchemaFactory.createForClass(Config);

export { ConfigSchema };
