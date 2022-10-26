import { Module } from '@nestjs/common';
import { NinepayPaymentService } from './ninepay-payment.service';
import { NinepayPaymentController } from './ninepay-payment.controller';

@Module({
  controllers: [NinepayPaymentController],
  providers: [NinepayPaymentService]
})
export class NinepayPaymentModule {}
