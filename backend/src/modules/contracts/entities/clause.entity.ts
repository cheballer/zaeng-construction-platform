import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContractType } from '../../../common/enums/contract-type.enum';
import { Contract } from './contract.entity';

@Entity('clauses')
export class Clause {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  contractId: string;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column()
  clauseNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'jsonb', nullable: true })
  keywords: string[];

  @Column({ type: 'int', nullable: true })
  timeBarDays: number;

  @Column({ type: 'jsonb', nullable: true })
  mandatoryFields: string[];

  @Column({ type: 'jsonb', nullable: true })
  scenarioLogic: any;

  @Column({ default: false })
  isCustom: boolean;

  @Column({ nullable: true })
  version: string;

  @Column({ type: 'text', nullable: true })
  caseLaw: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contract, (contract) => contract.clauses, { nullable: true })
  @JoinColumn({ name: 'contractId' })
  contract: Contract;
}

