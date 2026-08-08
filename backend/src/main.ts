import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const uploadsRoot = join(__dirname, '..', 'uploads');
  for (const purpose of ['images', 'pdfs', 'certificates', 'resumes']) {
    const dir = join(uploadsRoot, purpose);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
  app.useStaticAssets(uploadsRoot, { prefix: '/uploads/' });

  const corsOrigins = (process.env.CORS_ORIGIN ||
    'https://sbramajayam.github.io,https://sbramajayam.github.io/Ell-web-app,https://sbramajayam.github.io/Ellowring_App,https://sbramajayam.github.io/E-website-app,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
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
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = Number(process.env.PORT || 4000);
  // Bind all interfaces so cloud hosts (Render, etc.) can reach the API
  await app.listen(port, '0.0.0.0');
  console.log(`Ellowring API running on http://0.0.0.0:${port}/api/v1`);
}

bootstrap();
