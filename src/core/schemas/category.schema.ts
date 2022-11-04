import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Mixed, Types, SchemaTypes } from 'mongoose';

const { Mixed, ObjectId } = SchemaTypes;

export type CategoryDocument = Category & Document;

export class Category {
  @Prop({ index: true, default: '' })
  @ApiProperty({ required: false })
  path: string;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ unique: true, index: true })
  @ApiProperty()
  slug: string;

  @Prop({ default: true })
  @ApiProperty({ required: false })
  enabled: boolean;

  @Prop({ type: ObjectId })
  @ApiProperty({ required: false })
  parent: string | Types.ObjectId;

  @Prop({ type: [String], index: true })
  @ApiProperty({ required: false })
  ancestors: Array<string>;

  @Prop({ type: [String] })
  @ApiProperty({ required: false })
  ancestorsName: Array<string>;

  @Prop({ type: Number, default: 0, index: true })
  @ApiProperty({ required: false })
  ancestorsLength: number;

  @Prop({ default: false })
  @ApiProperty({ required: false })
  hasChildren: boolean;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ required: false })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ required: false })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
