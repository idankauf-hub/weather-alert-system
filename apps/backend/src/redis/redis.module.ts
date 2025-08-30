import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const redisUrl = cfg.get<string>('REDIS_URL');
        if (!redisUrl) {
          throw new Error('REDIS_URL is not defined in configuration');
        }
        const client = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });
        client.on('error', (e) => console.error('Redis error:', e.message));
        client
          .connect()
          .catch((e) => console.error('Redis connect failed:', e.message));
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
