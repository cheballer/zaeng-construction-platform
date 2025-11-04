import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ContractType, NoticeType } from '../../../common/enums/contract-type.enum';

@Entity('rules')
@Unique(['contractType', 'noticeType'])
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({
    type: 'enum',
    enum: NoticeType,
  })
  noticeType: NoticeType;

  @Column({ type: 'int' })
  timeBarDays: number;

  @Column({ type: 'jsonb' })
  mandatoryFields: string[];

  @Column({ type: 'jsonb', nullable: true })
  workflowStages: string[];

  @Column({ type: 'jsonb', nullable: true })
  clauseMapping: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column()
  version: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

