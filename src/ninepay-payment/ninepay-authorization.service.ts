import { NinepayModuleOptions } from './../../core/types/index';
import { Inject, Injectable } from '@nestjs/common'
import { AxiosInstance } from 'axios'

@Injectable()
export class PaypalAuthorizationService {
  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly options: NinepayModuleOptions
  ) {}

  getBasicKey() {
    return Buffer.from(
      this.options.clientId + '|' + this.options.clientSecret
    ).toString('base64')
  }
}
