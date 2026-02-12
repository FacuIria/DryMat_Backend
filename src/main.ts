import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Prefijo para toda la API
  app.setGlobalPrefix('api');

  // CORS para tu front (Vite)
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Validación global (para DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // borra props extra
      forbidNonWhitelisted: true, // si mandan props extra -> 400
      transform: true,            // convierte types (string->number etc)
    }),
  );

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
