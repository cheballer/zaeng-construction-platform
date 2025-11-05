import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3001';
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        frontendUrl,
        'https://zaeng-construction-platform-a3k6.vercel.app',
        'http://localhost:3001',
        'http://localhost:5173',
      ];
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now - tighten in production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Za-Eng Construction Platform API')
    .setDescription('AI-powered contract compliance and construction management platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('projects', 'Project management')
    .addTag('contracts', 'Contract and clause management')
    .addTag('notices', 'Notice and claim management')
    .addTag('evidence', 'Evidence repository')
    .addTag('marketplace', 'Expert marketplace')
    .addTag('admin', 'Administrative functions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Railway and other platforms set PORT dynamically - use process.env.PORT first
  const port = process.env.PORT || configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for Railway

  console.log(`🚀 Za-Eng Platform API running on: http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

