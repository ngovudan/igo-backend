export const PaymentMethod = {
  VNPay: 'vnpay',
  VietQR: 'vietqr',
  Cod: 'cod',
  Credit: 'credit',
  MoMo: 'momo',
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const OrderStatus = {
  AwaitingPayment: 'awaiting-payment',
  AwaitingShipment: 'awaiting-shipment',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;

export const PaymentStatus = {
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;

export const RedisKey = {
  // payment
  Bank: 'payment-methods:banks',
  VnPay: 'payment-methods:vnpay',
  MoMo: 'payment-methods:momo',
  VietQr: 'payment-methods:vietqr',
} as const;

export interface CategoryType {
  _id: string;
  path?: string;
  name: string;
  slug: string;
  imageThumb?: string;
  enabled: boolean;
  shortDescription?: string;
  description?: any;
  parent?: string | null;
  ancestors?: Array<string>;
  ancestorsName?: Array<string>;
  priority: number;
  hasChildren: boolean;
  children?: CategoryType[];
}
