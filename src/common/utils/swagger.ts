import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFileSync } from 'fs';

export function buildDocument(app: INestApplication) {
  // const decscription = readFileSync("decription.md", "utf-8")
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('IMEX Ecommerce')
    .setDescription('The Ecommerce API description')
    .setVersion('1.0')
    // .addTag("Introduction", decscription)
    .build();
  return SwaggerModule.createDocument(app, config);
}
