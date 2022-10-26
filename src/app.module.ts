import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MulterModule } from '@nestjs/platform-express'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { RouterModule, Routes } from '@nestjs/core'
import { ConfigsModule } from './configs/configs.module'
import { CategoriesModule } from './categories/categories.module'
import { EmailModule } from './email/email.module'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import configurations from './configurations'
import { PaypalPaymentModule } from './paypal-payment/paypal.module'

const routes: Routes = [
  {
    path: '/admin',
    children: [
      {
        path: '/user',
        module: UserModule
      },
      {
        path: '/configs',
        module: ConfigsModule
      },
      {
        path: '/categories',
        module: CategoriesModule
      }
    ]
  }
]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configurations]
    }),
    PaypalPaymentModule.register({
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live'
    }),
    PaypalPaymentModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get('paypalModuleInterface')
        }
      }
    }),
    EventEmitterModule.forRoot(),
    RouterModule.register(routes),
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin123@testing.ekytrsg.mongodb.net/?retryWrites=true&w=majority'
    ),
    UserModule,
    AuthModule,
    ConfigsModule,
    CategoriesModule,
    EmailModule,
    EmailConfirmationModule
  ],

  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
// export class AppModule implements OnModuleInit {
//
//   constructor(@InjectScandiniaviaPaypal() private paymentService: PaypalPaymentService) {
//   }
//   onModuleInit(): any {
//     const order: CreatePaypalOrderDto = {
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             "currency_code": "USD",
//             "value": "100.00"
//           },
//           reference_id: 'monitor'
//         }
//       ]
//     };
//     this.paymentService.initiateOrder(order, {
//       Prefer: 'return=representation'
//     }).then(r => {
//       console.log(r);
//       console.log('Refe: ', r.purchase_units[0].reference_id);
//       return this.paymentService.updateOrder(r.id, [
//         {
//           op: 'add',
//           path: `/purchase_units/@reference_id=='${r.purchase_units[0].reference_id}'/shipping/address`,
//           value: {
//             "address_line_1": "123 Townsend St",
//             "address_line_2": "Floor 6",
//             "admin_area_2": "San Francisco",
//             "admin_area_1": "CA",
//             "postal_code": "94107",
//             "country_code": "US"
//           }
//         }
//       ]);
//     })
//       .then(r => {
//         console.log('update: ', r);
//         return this.paymentService.getOrderDetails(r.id)
//       })
//       .then(r => {
//         console.log('r: ', r);
//       })
//       .catch(e => {
//         console.log(e.nativeError)
//       });
//
//
//   }
// }
