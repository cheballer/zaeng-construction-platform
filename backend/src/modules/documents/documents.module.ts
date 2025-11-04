import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { NoticesModule } from '../notices/notices.module';
import { EvidenceModule } from '../evidence/evidence.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [NoticesModule, EvidenceModule, ProjectsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

