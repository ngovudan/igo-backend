import { Injectable } from '@nestjs/common'
@Injectable()
export class PaypalUtilsService {
  getApiUrl(environment: 'live' | 'sandbox') {
    return environment === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com'
  }
}
