import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenceController } from './evidence.controller';
import { EvidenceService } from './evidence.service';
import { Evidence } from './entities/evidence.entity';
import { StorageModule } from '../storage/storage.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evidence]),
    StorageModule,
    OcrModule,
  ],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}

