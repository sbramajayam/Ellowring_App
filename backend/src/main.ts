import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const corsOrigins = (process.env.CORS_ORIGIN ||
    'https://sbramajayam.github.io,https://sbramajayam.github.io/Ell-web-app,https://sbramajayam.github.io/Ellowring_App,http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = Number(process.env.PORT || 4000);
  // Bind all interfaces so cloud hosts (Render, etc.) can reach the API
  await app.listen(port, '0.0.0.0');
  console.log(`Ellowring API running on http://0.0.0.0:${port}/api`);
}

bootstrap();
