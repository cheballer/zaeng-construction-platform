import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiClauseService } from './ai-clause.service';
import { VectorDbService } from './vector-db.service';
import { Clause } from '../contracts/entities/clause.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clause])],
  providers: [AiClauseService, VectorDbService],
  exports: [AiClauseService, VectorDbService],
})
export class AiModule {}

