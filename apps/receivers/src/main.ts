/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const port = new ConfigService().get('port') || 3005;
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port,
    },
  } as TcpOptions);
  await app.listen();
  await app.listen();
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();