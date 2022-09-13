import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
    return {
      secret: configService.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES')
      }
    };
  },
  inject: [ConfigService]
};
