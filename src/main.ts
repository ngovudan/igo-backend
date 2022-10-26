import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import * as compression from 'compression'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('port')

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  })

  app.use(compression())

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/'
  })

  await app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
  )
}

bootstrap().then()
