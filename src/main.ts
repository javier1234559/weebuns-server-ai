import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression());
  // Enabling service container for custom validator constraint classes (class-validator)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      // Enable transformation of incoming data to DTO instance
      // This allows default values in DTOs to be applied
      // Example: class UserDto { @IsOptional() age: number = 0; }
      // Request without age will have age set to 0
      transform: true,
      transformOptions: {
        // Automatically convert primitive types
        // Example: "1" (string) becomes 1 (number) if the DTO property is number
        // Works with: numbers, booleans, and simple arrays
        // Query: ?age=25 (string) -> { age: 25 } (number)
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Weebuns backend lms api')
    .setDescription(
      'This docs includes all the endpoints of the weebuns lms api',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(config.port);
}
bootstrap();
