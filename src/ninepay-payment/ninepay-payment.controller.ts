import { Controller } from '@nestjs/common';
import { NinepayPaymentService } from './ninepay-payment.service';

@Controller('ninepay-payment')
export class NinepayPaymentController {
  constructor(private readonly ninepayPaymentService: NinepayPaymentService) {}
}
