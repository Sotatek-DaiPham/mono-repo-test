import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DateTransformInterceptor } from './common/interceptors/date-transform.interceptor';

// Set Node.js process timezone to UTC
// This ensures all Date operations use UTC timezone
process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global date transform interceptor - ensures all Date objects are serialized as ISO strings
  app.useGlobalInterceptors(new DateTransformInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Fullstack CRUD API')
    .setDescription('API documentation for Fullstack CRUD application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();

