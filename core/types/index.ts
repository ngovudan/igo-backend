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
