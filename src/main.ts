import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Adding payload validation pipe globally
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  await app.listen(4000);
}
bootstrap();
