import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get('port');

  await app.listen(PORT, () => {
    Logger.log(`Listening at https://localhost:${PORT}/`);
  });
}

bootstrap();
