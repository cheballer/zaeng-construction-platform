import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      message: 'Za-Eng Construction Platform API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  getDetailedHealth() {
    return {
      status: 'ok',
      message: 'Za-Eng Construction Platform API',
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV') || 'development',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected', // TODO: Add actual health checks
        redis: 'connected',
        storage: 'available',
      },
    };
  }
}

