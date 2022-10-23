import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors();

  app.use(compression());

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  await app.listen(4444);
}

bootstrap();
