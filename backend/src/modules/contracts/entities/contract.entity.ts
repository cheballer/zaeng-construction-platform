import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ContractType } from '../../../common/enums/contract-type.enum';
import { Clause } from './clause.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: 'text', nullable: true })
  ocrText: string;

  @Column({ type: 'jsonb', nullable: true })
  zClauses: any[];

  @Column({ default: false })
  processed: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Clause, (clause) => clause.contract, { cascade: true })
  clauses: Clause[];
}

