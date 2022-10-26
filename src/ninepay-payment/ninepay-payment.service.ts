import { Injectable } from '@nestjs/common'
import { NineUtilsService } from './ninepay-utils.service'
// import { PaypalUtilsService } from 'src/paypal-payment/paypal-utils.service'
import { AxiosInstance } from 'axios'
import { NinepayModuleOptions } from 'core/types'

@Injectable()
export class NinepayPaymentService {
  constructor(
    private readonly axiosInstance: AxiosInstance,
    private ninepayUtilsService: NineUtilsService,
    private readonly options: NinepayModuleOptions
  ) {}

  async initiateOrder(header?: any): Promise<any> {
    const apiUrl = this.ninepayUtilsService.getApiUrl(this.options.environment)

    const orderPayload = {}

    return this.axiosInstance.post(
      `${apiUrl}/service/deposit-transfer/request`,
      orderPayload,
      {}
    )
  }
}
