import { ModuleMetadata, Provider, Type } from '@nestjs/common'
import { type } from 'os'

export const PaymentMethod = {
  VNPay: 'vnpay',
  VietQR: 'vietqr',
  Cod: 'cod',
  Credit: 'credit',
  MoMo: 'momo'
} as const
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]

export const OrderStatus = {
  AwaitingPayment: 'awaiting-payment',
  AwaitingShipment: 'awaiting-shipment',
  Completed: 'completed',
  Cancelled: 'cancelled'
} as const

export const PaymentStatus = {
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed'
} as const

export const RedisKey = {
  // payment
  Bank: 'payment-methods:banks',
  VnPay: 'payment-methods:vnpay',
  MoMo: 'payment-methods:momo',
  VietQr: 'payment-methods:vietqr'
} as const

export interface CategoryType {
  _id: string
  path?: string
  name: string
  slug: string
  imageThumb?: string
  enabled: boolean
  shortDescription?: string
  description?: any
  parent?: string | null
  ancestors?: Array<string>
  ancestorsName?: Array<string>
  priority: number
  hasChildren: boolean
  children?: CategoryType[]
}

// 9Pay

export type NinepayModuleOptions = {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
}

// Paypal
export type PaypalModuleOptions = {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'live'
}

export interface PaypalModuleOptionsFactory {
  createPaypalModuleOptions():
    | Promise<PaypalModuleOptions>
    | PaypalModuleOptions
}

export interface PaypalModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<PaypalModuleOptionsFactory>
  useClass?: Type<PaypalModuleOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<PaypalModuleOptions> | PaypalModuleOptions
  inject?: any[]
  extraProviders?: Provider[]
}