import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get('port');

  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs');

  await app.listen(PORT, () => {
    Logger.log(`Listening at https://localhost:${PORT}/`);
  });
}

bootstrap();
