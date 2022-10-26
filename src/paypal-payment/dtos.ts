// import { PaypalPayerDto, PurchaseUnitRequestDto, PaypalApplicationContextDto } from '@app/dtos';
import { OmitType } from '@nestjs/mapped-types'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'

export class AllowedValueToPatchOrderDto {
  @IsOptional()
  intent?: 'CAPTURE' | 'AUTHORIZE'

  @IsOptional()
  payer?: PaypalPayerDto

  @IsArray()
  @IsOptional()
  purchase_units?: PurchaseUnitRequestDto[]
}
export class UpdatePaypalOrderDto {
  @IsNotEmpty()
  op: PaypalOperationDto

  @IsOptional()
  path?: string

  @IsOptional()
  value?: any

  @IsOptional()
  from?: string
}

export type PaypalOperationDto =
  | 'add'
  | 'remove'
  | 'replace'
  | 'move'
  | 'copy'
  | 'test'

export class PaypalOrderDto {
  @Matches(
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])[T,t]([0-1][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)([.][0-9]+)?([Zz]|[+-][0-9]{2}:[0-9]{2})$/
  )
  create_time: string
  // The date and time when the transaction was last updated
  @Matches(
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])[T,t]([0-1][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)([.][0-9]+)?([Zz]|[+-][0-9]{2}:[0-9]{2})$/
  )
  update_time: string

  id: string

  // The payment source used to fund the payment.
  payment_source: PaymentSourceResponseDto

  intent: 'CAPTURE' | 'AUTHORIZE'

  payer: PaypalPayerDto

  purchase_units: PurchaseUnitRequestDto[]

  status: PaypalOrderStatusDto

  links: PaypalLinkDescriptionDto[]
}

export class InitiateOrderHeadersDto {
  // The server stores keys for 6 hours. The API callers can request the times to up to 72 hours by speaking to their Account Manager.
  'PayPal-Request-Id'?: string
  'PayPal-Partner-Attribution-Id'?: string
  'PayPal-Client-Metadata-Id'?: string

  // The preferred server response upon successful completion of the request. Value is:
  // return=minimal. The server returns a minimal response to optimize communication between the API caller and the server. A minimal response includes the id, status and HATEOAS links.
  // return=representation. The server returns a complete resource representation, including the current state of the resource.
  Prefer?: 'return=minimal' | 'return=representation'
}

export class AuthorizeOrderHeadersDto extends OmitType(
  InitiateOrderHeadersDto,
  ['PayPal-Partner-Attribution-Id']
) {
  // An API-caller-provided JSON Web Token (JWT) assertion that identifies the merchant. For details, see PayPal-Auth-Assertion.
  @IsOptional()
  'PayPal-Auth-Assertion'?: string
}

export class InitiateTokenResponseDto {
  scope: string
  access_token: string
  app_id: string
  expires_in: number
  nonce: string
}

export class CreatePaypalOrderDto {
  intent?: 'CAPTURE' | 'AUTHORIZE'
  payer?: PaypalPayerDto
  purchase_units?: PurchaseUnitRequestDto[]
  application_context?: PaypalApplicationContextDto
}

export type PaypalOrderStatusDto =
  // The possible values are:
  //
  // CREATED. The order was created with the specified context.
  // SAVED. The order was saved and persisted. The order status continues to be in progress until a capture is made with final_capture = true for all purchase units within the order.
  // APPROVED. The customer approved the payment through the PayPal wallet or another form of guest or unbranded payment. For example| a card| bank account| or so on.
  // VOIDED. All purchase units in the order are voided.
  // COMPLETED. The payment was authorized or the authorized payment was captured for the order.
  // PAYER_ACTION_REQUIRED. The order requires an action from the payer (e.g. 3DS authentication). Redirect the payer to the "rel":"payer-action" HATEOAS link returned as part of the response prior to authorizing or capturing the order.
  | 'CREATED'
  | 'SAVED'
  | 'APPROVED'
  | 'VOIDED'
  | 'COMPLETED'
  | 'PAYER_ACTION_REQUIRED'

export class PaypalPayerBaseDto {
  // Maximum length: 254.
  // Pattern: (?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]).
  email_address?: string

  // The PayPal-assigned ID for the payer.
  // Pattern: ^[2-9A-HJ-NP-Z]{13}$
  // Minimum length: 13.
  // Maximum length: 13.
  payer_id?: string
}

export class PaypalPayerDto extends PaypalPayerBaseDto {
  // The name of the payer. Supports only the given_name and surname properties.
  name?: PaypalNameDto

  // The phone number of the customer. Available only when you enable the Contact Telephone Number option in the Profile & Settings for the merchant's PayPal account. The phone.phone_number supports only national_number.
  phone?: any

  // The birth date of the payer in YYYY-MM-DD format.
  birth_date?: string

  // The tax information of the payer. Required only for Brazilian payer's. Both tax_id and tax_id_type are required.
  tax_info?: PaypalTaxInfoDto

  // The address of the payer. Supports only the address_line_1, address_line_2, admin_area_1, admin_area_2, postal_code, and country_code properties. Also referred to as the billing address of the customer.
  address?: PaypalPortableAddress
}

export class PaypalNameDto {
  // The prefix, or title, to the party's name.
  // Maximum length: 140.
  @MaxLength(140)
  @IsOptional()
  prefix?: string

  @IsOptional()
  given_name?: string

  @IsOptional()
  surname?: string

  @IsOptional()
  middle_name?: string

  @IsOptional()
  suffix?: string

  // DEPRECATED. The party's alternate name. Can be a business name, nickname, or any other name that cannot be split into first, last name. Required when the party is a business
  // Maximum length: 300.
  @MaxLength(300)
  @IsOptional()
  alternate_full_name?: string
  // When the party is a person, the party's full name.
  // Maximum length: 300.
  @MaxLength(300)
  @IsOptional()
  full_name?: string

  // The full name representation like Mr J Smith.
  @MinLength(3)
  @MaxLength(300)
  @IsOptional()
  name?: string
}

export class PaypalTaxInfoDto {
  // The customer's tax ID value.
  @IsNotEmpty()
  @MaxLength(14)
  tax_id: string

  // The customer's tax ID type.
  // The possible values are:
  //  - BR_CPF. The individual tax ID type, typically is 11 characters long.
  //  - BR_CNPJ. The business tax ID type, typically is 14 characters long.
  tax_id_type: 'BR_CPF' | 'BR_CNPJ'
}

export class PurchaseUnitRequestDto {
  // The API caller-provided external ID for the purchase unit.
  // Required for multiple purchase units when you must update the order through PATCH.
  // If you omit this value and the order contains only one purchase unit, PayPal sets this value to default
  // Maximum length: 256.
  @MaxLength(256)
  reference_id?: string

  // The total order amount with an optional breakdown that provides details, such as the total item amount, total tax amount, shipping, handling, insurance, and discounts, if any.
  // If you specify amount.breakdown, the amount equals item_total plus tax_total plus shipping plus handling plus insurance minus shipping_discount minus discount.
  // The amount must be a positive number. For listed of supported currencies and decimal precision, see the PayPal REST APIs Currency Codes.
  amount?: AmountWithBreakdownDto

  payee?: PaypalPayeeDto

  // Any additional payment instructions to be consider during payment processing. This processing instruction is applicable for Capturing an order or Authorizing an Order.
  payment_instruction?: PaypalPaymentInstructionDto

  // The purchase description.
  @MaxLength(127)
  description?: string

  // The API caller-provided external ID. Used to reconcile client transactions with PayPal transactions. Appears in transaction and settlement reports but is not visible to the payer.
  @MaxLength(127)
  custom_id?: string

  // The API caller-provided external invoice number for this order. Appears in both the payer's transaction history and the emails that the payer receives.
  @MaxLength(127)
  invoice_id?: string

  // The soft descriptor is the dynamic text used to construct the statement descriptor that appears on a payer's card statement.
  //
  // If an Order is paid using the "PayPal Wallet", the statement descriptor will appear in following format on the payer's card statement: PAYPAL_prefix+(space)+merchant_descriptor+(space)+ soft_descriptor
  // The PAYPAL prefix uses 8 characters. Only the first 22 characters will be displayed in the statement.
  // For example, if:
  //  - The PayPal prefix toggle is PAYPAL .
  //  - The merchant descriptor in the profile is Janes Gift.
  //  - The soft descriptor is 800-123-1234.
  //  - Then, the statement descriptor on the card is PAYPAL Janes Gift 80.
  @MaxLength(22)
  soft_descriptor?: string

  // An array of items that the customer purchases from the merchant.
  items?: PaypalPurchaseItemDto[]

  shipping?: PaypalShippingDto
}

export class PaypalShippingName {
  // When the party is a person, the party's full name.
  full_name: string
}

export class PaypalShippingDto {
  // The name of the person to whom to ship the items. Supports only the full_name property.
  @MaxLength(300)
  name: PaypalShippingName

  // The method by which the payer wants to get their items from the payee e.g shipping, in-person pickup. Either type or options but not both may be present.
  // The possible values are:
  //  - SHIPPING. The payer intends to receive the items at a specified address.
  //  - PICKUP_IN_PERSON. The payer intends to pick up the items from the payee in person.
  // Pattern: ^[0-9A-Z_]+$.
  @Length(1, 255)
  @Matches(/^[0-9A-Z_]+$/)
  type: 'SHIPPING' | 'PICKUP_IN_PERSON'

  // The address of the person to whom to ship the items. Supports only the address_line_1, address_line_2, admin_area_1, admin_area_2, postal_code, and country_code properties.
  address: PaypalPortableAddress
}

export class PaypalPortableAddress {
  // The first line of the address. For example, number or street. For example, 173 Drury Lane. Required for data entry and compliance and risk checks. Must contain the full address.
  @MaxLength(300)
  address_line_1: string

  // The second line of the address. For example, suite or apartment number.
  @MaxLength(300)
  address_line_2: string

  // The highest level sub-division in a country, which is usually a province, state, or ISO-3166-2 subdivision. Format for postal delivery. For example, CA and not California. Value, by country, is:
  //  - UK. A county.
  //  - US. A state.
  //  - Canada. A province.
  //  - Japan. A prefecture.
  //  - Switzerland. A kanton.
  @MaxLength(300)
  admin_area_1: string

  // A city, town, or village. Smaller than admin_area_level_1.
  @MaxLength(120)
  admin_area_2: string
  // The postal code, which is the zip code or equivalent. Typically required for countries with a postal code or an equivalent. See postal code.
  postal_code: string
  // The two-character ISO 3166-1 code that identifies the country or region.
  country_code: string
}

export class PaypalPurchaseItemDto {
  // The item name or title.
  @IsNotEmpty()
  @Length(1, 127)
  name: string

  // The item price or rate per unit. If you specify unit_amount, purchase_units[].amount.breakdown.item_total is required. Must equal unit_amount * quantity for all items. unit_amount.value can not be a negative number.
  unit_amount: PaypalMoneyDto

  // The item tax for each unit. If tax is specified, purchase_units[].amount.breakdown.tax_total is required. Must equal tax * quantity for all items. tax.value can not be a negative number.
  tax: PaypalMoneyDto

  // The item quantity. Must be a whole number.
  // Pattern: ^[1-9][0-9]{0,9}$.
  @MaxLength(10)
  @IsNotEmpty()
  quantity: string

  // The detailed item description.
  @MaxLength(127)
  description: string

  // The stock keeping unit (SKU) for the item.
  @MaxLength(127)
  sku: string

  // The item category type.
  // The possible values are:
  //  - DIGITAL_GOODS. Goods that are stored, delivered, and used in their electronic format. This value is not currently supported for API callers that leverage the [PayPal for Commerce Platform](https://www.paypal.com/us/webapps/mpp/commerce-platform) product
  //  - PHYSICAL_GOODS. A tangible item that can be shipped with proof of delivery.
  @Length(1, 20)
  category: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS'
}

export class PaypalMoneyDto {
  // The three-character ISO-4217 currency code that identifies the currency.
  @IsNotEmpty()
  @Length(3, 3)
  currency_code: string

  // The value, which might be:
  //  - An integer for currencies like JPY that are not typically fractional.
  //  - A decimal fraction for currencies like TND that are subdivided into thousandths.
  // For the required number of decimal places for a currency code, see Currency Codes.
  // Pattern: ^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$.
  @IsNotEmpty()
  @MaxLength(32)
  value: string
}

export class PaypalPayeeBaseDto {
  email_address: string
  merchant_id: string
}

export class PaypalPayeeDto extends PaypalPayeeBaseDto {}

export class AmountWithBreakdownDto {
  @IsNotEmpty()
  @Length(3, 3)
  currency_code: string

  // The value, which might be:
  //  - An integer for currencies like JPY that are not typically fractional.
  //  - A decimal fraction for currencies like TND that are subdivided into thousandths.
  // For the required number of decimal places for a currency code, see Currency Codes.
  // Maximum length: 32.
  // Pattern: ^((-?[0-9]+)|(-?([0-9]+)?[.][0-9]+))$.
  @IsNotEmpty()
  @MaxLength(32)
  value: string

  breakdown?: AmountBreakDownDto
}

export class AmountBreakDownDto {
  // The subtotal for all items. Required if the request includes purchase_units[].items[].unit_amount.
  // Must equal the sum of (items[].unit_amount * items[].quantity) for all items. item_total.value can not be a negative number.
  item_total: PaypalMoneyDto
  // The shipping fee for all items within a given purchase_unit. shipping.value can not be a negative number.
  shipping: PaypalMoneyDto
  // The handling fee for all items within a given purchase_unit. handling.value can not be a negative number.
  handling: PaypalMoneyDto
  // The total tax for all items. Required if the request includes purchase_units.items.tax. Must equal the sum of (items[].tax * items[].quantity) for all items.
  // tax_total.value can not be a negative number.
  tax_total: PaypalMoneyDto
  // The insurance fee for all items within a given purchase_unit. insurance.value can not be a negative number.
  insurance: PaypalMoneyDto
  // The shipping discount for all items within a given purchase_unit. shipping_discount.value can not be a negative number.
  shipping_discount: PaypalMoneyDto
  // The discount for all items within a given purchase_unit. discount.value can not be a negative number.
  discount: PaypalMoneyDto
}

export class PaypalPaymentInstructionDto {
  // An array of various fees, commissions, tips, or donations. This field is only applicable to merchants that been enabled for PayPal Commerce Platform for Marketplaces and Platforms capability.
  platform_fees: PaypalPlatformFeeDto[]

  // The funds that are held on behalf of the merchant.
  //
  // The possible values are:
  //
  //  - INSTANT. The funds are released to the merchant immediately.
  //  - DELAYED. The funds are held for a finite number of days. The actual duration depends on the region and type of integration. You can release the funds through a referenced payout. Otherwise, the funds disbursed automatically after the specified duration.
  disbursement_mode: 'INSTANT' | 'DELAYED'

  // This field is only enabled for selected merchants/partners to use and provides the ability to trigger a specific pricing rate/plan for a payment transaction.
  // The list of eligible 'payee_pricing_tier_id' would be provided to you by your Account Manager.
  // Specifying values other than the one provided to you by your account manager would result in an error.
  @Length(1, 20)
  payee_pricing_tier_id: string
}

export class PaypalPlatformFeeDto {
  amount: PaypalMoneyDto
  payee: PaypalPayeeBaseDto
}

export class CardResponseDto {
  // The card holder's name as it appears on the card.
  @Length(2, 300)
  name: string
  billing_address: PaypalPortableAddress

  // The last digits of the payment card.
  @Matches(/[0-9]{2,}/)
  last_digits: string

  // The card brand or network. Typically used in the response.
  brand: PaypalBrandsEnumDto

  // The payment card type.
  type: CardsTypesEnumDto

  // Results of Authentication such as 3D Secure.
  authentication_result: PaypalAuthenticationResponseDto
}

export class PaymentSourceResponseDto {
  card: CardResponseDto
}

export enum CardsTypesEnumDto {
  CREDIT,
  DEBIT,
  PREPAID,
  UNKNOWN
}

export class PaypalAuthenticationResponseDto {
  // Liability shift indicator. The outcome of the issuer's authentication.
  @Matches(/^[0-9A-Z_]+$/)
  @Length(1, 255)
  liability_shift: LiabilityShiftEnumsDto

  // Results of 3D Secure Authentication.
  three_d_secure: ThreeDSecureAuthenticationResponseDto
}

export enum PaypalBrandsEnumDto {
  // The possible values are:
  //  - VISA. Visa card.
  //  - MASTERCARD. Mastecard card.
  //  - DISCOVER. Discover card.
  //  - AMEX. American Express card.
  //  - SOLO. Solo debit card.
  //  - JCB. Japan Credit Bureau card.
  //  - STAR. Military Star card.
  //  - DELTA. Delta Airlines card.
  //  - SWITCH. Switch credit card.
  //  - MAESTRO. Maestro credit card.
  //  - CB_NATIONALE. Carte Bancaire (CB) credit card.
  //  - CONFIGOGA. Configoga credit card.
  //  - CONFIDIS. Confidis credit card.
  //  - ELECTRON. Visa Electron credit card.
  //  - CETELEM. Cetelem credit card.
  //  - CHINA_UNION_PAY. China union pay credit card.
  'VISA',
  'MASTERCARD',
  'DISCOVER',
  'AMEX',
  'SOLO',
  'JCB',
  'STAR',
  'DELTA',
  'SWITCH',
  'MAESTRO',
  'CB_NATIONALE',
  'CONFIGOGA',
  'CONFIDIS',
  'ELECTRON',
  'CETELEM',
  'CHINA_UNION_PAY'
}

export enum LiabilityShiftEnumsDto {
  'YES',
  'NO',
  'POSSIBLE',
  'UNKNOWN'
}

export class ThreeDSecureAuthenticationResponseDto {
  authentication_status: PaypalAuthenticationStatusDto
  enrollment_status: PaypalEnrollmentStatusDto
}

export enum PaypalAuthenticationStatusDto {
  'Y',
  'N',
  'U',
  'A',
  'C',
  'R',
  'D',
  'I'
}

export enum PaypalEnrollmentStatusDto {
  'Y',
  'N',
  'U',
  'B'
}

export class PaypalLinkDescriptionDto {
  @IsNotEmpty()
  href: string
  @IsNotEmpty()
  rel: string
  method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'HEAD'
    | 'CONNECT'
    | 'OPTIONS'
    | 'PATCH'
}

export class PaypalApplicationContextDto {
  // The label that overrides the business name in the PayPal account on the PayPal site.
  @MaxLength(127)
  brand_name?: string

  // The BCP 47-formatted locale of pages that the PayPal payment experience shows. PayPal supports a five-character code. For example, da-DK, he-IL, id-ID, ja-JP, no-NO, pt-BR, ru-RU, sv-SE, th-TH, zh-CN, zh-HK, or zh-TW.
  @Length(2, 10)
  @Matches(/^[a-z]{2}(?:-[A-Z][a-z]{3})?(?:-(?:[A-Z]{2}))?$/)
  locale?: string

  // The type of landing page to show on the PayPal site for customer checkout.
  // The possible values are:
  //  - LOGIN. When the customer clicks PayPal Checkout, the customer is redirected to a page to log in to PayPal and approve the payment.
  //  - BILLING. When the customer clicks PayPal Checkout, the customer is redirected to a page to enter credit or debit card and other relevant billing information required to complete the purchase.
  //  - NO_PREFERENCE. When the customer clicks PayPal Checkout, the customer is redirected to either a page to log in to PayPal and approve the payment or to a page to enter credit or debit card and other relevant billing information required to complete the purchase, depending on their previous interaction with PayPal.
  landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE'

  // The shipping preference:
  //  - Displays the shipping address to the customer.
  //  - Enables the customer to choose an address on the PayPal site.
  //  - Restricts the customer from changing the address during the payment-approval process.
  // The possible values are:
  //  - GET_FROM_FILE. Use the customer-provided shipping address on the PayPal site.
  //  - NO_SHIPPING. Redact the shipping address from the PayPal site. Recommended for digital goods.
  //  - SET_PROVIDED_ADDRESS. Use the merchant-provided address. The customer cannot change this address on the PayPal site.
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS'

  // Configures a Continue or Pay Now checkout flow.
  // The possible values are:
  //  - CONTINUE. After you redirect the customer to the PayPal payment page, a Continue button appears. Use this option when the final amount is not known when the checkout flow is initiated and you want to redirect the customer to the merchant page without processing the payment.
  //  - PAY_NOW. After you redirect the customer to the PayPal payment page, a Pay Now button appears. Use this option when the final amount is known when the checkout is initiated and you want to process the payment immediately when the customer clicks Pay Now.
  user_action?: 'CONTINUE' | 'PAY_NOW'

  // The customer and merchant payment preferences.
  payment_method?: PaypalPaymentMethodDto

  // The URL where the customer is redirected after the customer approves the payment.
  return_url?: string

  // The URL where the customer is redirected after the customer cancels the payment.
  cancel_url?: string

  // Provides additional details to process a payment using a payment_source that has been stored or is intended to be stored (also referred to as stored_credential or card-on-file).
  // Parameter compatibility:
  //  - payment_type=ONE_TIME is compatible only with payment_initiator=CUSTOMER.
  //  - usage=FIRST is compatible only with payment_initiator=CUSTOMER.
  //  - previous_transaction_reference or previous_network_transaction_reference is compatible only with payment_initiator=MERCHANT.
  //  - Only one of the parameters - previous_transaction_reference and previous_network_transaction_reference - can be present in the request.
  stored_payment_source?: PaypalStoredPaymentSourceDto
}

export enum PaypalStoredPaymentSourcePaymentTypeDto {
  'ONE_TIME',
  'RECURRING',
  'UNSCHEDULED'
}

export enum PaypalStoredPaymentSourceUsageTypeDto {
  'FIRST',
  'SUBSEQUENT',
  'DERIVED'
}

export class PaypalStoredPaymentSourceDto {
  // The person or party who initiated or triggered the payment.
  // The possible values are:
  //  - CUSTOMER. Payment is initiated with the active engagement of the customer. e.g. a customer checking out on a merchant website.
  //  - MERCHANT. Payment is initiated by merchant on behalf of the customer without the active engagement of customer. e.g. a merchant charging the monthly payment of a subscription to the customer.
  @Length(1, 255)
  @Matches(/^[0-9A-Z_]+$/)
  payment_initiator: 'CUSTOMER' | 'MERCHANT'

  // Indicates the type of the stored payment_source payment.
  // The possible values are:
  //  - ONE_TIME. One Time payment such as online purchase or donation. (e.g. Checkout with one-click).
  //  - RECURRING. Payment which is part of a series of payments with fixed or variable amounts, following a fixed time interval. (e.g. Subscription payments).
  //  - UNSCHEDULED. Payment which is part of a series of payments that occur on a non-fixed schedule and/or have variable amounts. (e.g. Account Topup payments).
  @Length(1, 255)
  @Matches(/^[0-9A-Z_]+$/)
  payment_type: PaypalStoredPaymentSourcePaymentTypeDto

  // Indicates if this is a first or subsequent payment using a stored payment source (also referred to as stored credential or card on file).
  // The possible values are:
  //  - FIRST. Indicates the Initial/First payment with a payment_source that is intended to be stored upon successful processing of the payment.
  //  - SUBSEQUENT. Indicates a payment using a stored payment_source which has been successfully used previously for a payment.
  //  - DERIVED. Indicates that PayPal will derive the value of `FIRST` or `SUBSEQUENT` based on data available to PayPal.
  @Length(1, 255)
  @Matches(/^[0-9A-Z_]+$/)
  usage: PaypalStoredPaymentSourceUsageTypeDto

  previous_network_transaction_reference: PaypalNetworkTransactionReferenceDto
}

export class PaypalNetworkTransactionReferenceDto {
  // Transaction reference id returned by the scheme. For Visa and Amex, this is the "Tran id" field in response. For MasterCard, this is the "BankNet reference id" field in response. For Discover, this is the "NRID" field in response.
  @Length(9, 15)
  @Matches(/^[a-zA-Z0-9]+$/)
  id: string

  // The date that the transaction was authorized by the scheme. For MasterCard, this is the "BankNet reference date" field in response
  @Length(4, 4)
  @Matches(/^[0-9]+$/)
  date: string

  // Name of the card network through which the transaction was routed.

  network: PaypalBrandsEnumDto
}

export class PaypalPaymentMethodDto {
  // The customer-selected payment method on the merchant site.
  @MinLength(1)
  @Matches(/^[0-9A-Z_]+$/)
  payer_selected: any

  // The merchant-preferred payment methods.
  // The possible values are:
  //  - UNRESTRICTED. Accepts any type of payment from the customer.
  //  - IMMEDIATE_PAYMENT_REQUIRED. Accepts only immediate payment from the customer. For example, credit card, PayPal balance, or instant ACH. Ensures that at the time of capture, the payment does not have the `pending` status.
  payee_preferred: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED'

  // NACHA (the regulatory body governing the ACH network) requires that API callers (merchants, partners) obtain the consumer’s explicit authorization before initiating a transaction. To stay compliant, you’ll need to make sure that you retain a compliant authorization for each transaction that you originate to the ACH Network using this API. ACH transactions are categorized (using SEC codes) by how you capture authorization from the Receiver (the person whose bank account is being debited or credited). PayPal supports the following SEC codes.
  // The possible values are:
  //  - TEL. The API caller (merchant/partner) accepts authorization and payment information from a consumer over the telephone.
  //  - WEB. The API caller (merchant/partner) accepts Debit transactions from a consumer on their website.
  //  - CCD. Cash concentration and disbursement for corporate debit transaction. Used to disburse or consolidate funds. Entries are usually Optional high-dollar, low-volume, and time-critical. (e.g. intra-company transfers or invoice payments to suppliers).
  //  - PPD. Prearranged payment and deposit entries. Used for debit payments authorized by a consumer account holder, and usually initiated by a company. These are usually recurring debits (such as insurance premiums).
  @Length(3, 255)
  standard_entry_class_code: 'TEL' | 'WEB' | 'CCD' | 'PPD'
}
