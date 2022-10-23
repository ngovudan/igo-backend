import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { ApiTokenCheckMiddleware } from 'common/middleware/api-token-check.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [
  {
    path: '/admin',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/user',
        module: UserModule,
      },
    ],
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    RouterModule.register(routes),
    MulterModule.register({ dest: './uploads' }),
    UserModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin123@testing.ekytrsg.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(ApiTokenCheckMiddleware)
    //   .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
