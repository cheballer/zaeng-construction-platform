import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { Notice } from './entities/notice.entity';
import { Claim } from './entities/claim.entity';
import { AiModule } from '../ai/ai.module';
import { RulesModule } from '../rules/rules.module';
import { ProjectsModule } from '../projects/projects.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice, Claim]),
    AiModule,
    RulesModule,
    ProjectsModule,
    NotificationsModule,
  ],
  controllers: [NoticesController],
  providers: [NoticesService],
  exports: [NoticesService],
})
export class NoticesModule {}

