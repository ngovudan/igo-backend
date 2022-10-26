import { Injectable } from '@nestjs/common'
@Injectable()
export class NineUtilsService {
  getApiUrl(environment: 'production' | 'sandbox') {
    return environment === 'sandbox'
      ? 'https://stg-api-console.9pay.mobi'
      : 'https://api-console.9pay.vn'
  }
}
