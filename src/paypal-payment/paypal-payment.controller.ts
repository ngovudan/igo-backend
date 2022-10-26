import { Controller } from '@nestjs/common';
import { PaypalPaymentService } from './paypal-payment.service';

@Controller('paypal-payment')
export class PaypalPaymentController {
  constructor(private readonly paypalPaymentService: PaypalPaymentService) {}
}
