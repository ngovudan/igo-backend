import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
// import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ApiTokenCheckMiddleware } from 'common/middleware/api-token-check.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    EventEmitterModule.forRoot(),
    MulterModule.register({ dest: './uploads' }),
    UserModule,
    AuthModule,
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
