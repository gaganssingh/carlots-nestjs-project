import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚠️⚠️⚠️⚠️
  // MOVED VALIDATION PIPE & COOKIE-SESSION
  // MIDDLEWARES TO app.module.ts
  // ⚠️⚠️⚠️⚠️

  await app.listen(3000);
}
bootstrap();
