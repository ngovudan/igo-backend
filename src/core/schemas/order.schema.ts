import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrderStatus } from 'src/core/types';

const {
  SchemaTypes: { Mixed },
} = mongoose;

export type OrderDocument = Order & mongoose.Document;

export class Order {
  @Prop({ type: String, unique: true, required: true })
  orderNumber: string;

  @Prop()
  customer: string;

  @Prop()
  grandTotal: number; // price with promotion and tax

  @Prop()
  itemsCount: number; // count qty of `selected` items

  @Prop()
  note: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: 'awaiting-payment',
  })
  status: typeof OrderStatus;

  @Prop(raw([]))
  items: Array<Record<string, any>>;

  @Prop({ type: Mixed })
  shippingAddress: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
