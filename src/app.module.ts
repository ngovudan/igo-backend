import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { RouterModule, Routes } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import * as Joi from '@hapi/joi'

const routes: Routes = [
  {
    path: '/admin',
    children: [
      {
        path: '/user',
        module: UserModule
      }
    ]
  }
]

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
      renderPath: '/docs'
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin123@testing.ekytrsg.mongodb.net/?retryWrites=true&w=majority'
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required()
        // ...
      })
    }),
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
