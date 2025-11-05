import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
      // Auto-create tables in development or if ENABLE_SYNC is set (for initial Railway setup)
      synchronize: 
        this.configService.get<string>('NODE_ENV') === 'development' ||
        this.configService.get<string>('ENABLE_SYNC') === 'true',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      ssl: this.configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      extra: {
        max: 20, // Maximum number of connections
        connectionTimeoutMillis: 30000,
      },
    };
  }
}

