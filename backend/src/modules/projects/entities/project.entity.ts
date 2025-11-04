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

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  referenceNumber: string;

  @Column()
  client: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  completionDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  contractValue: number;

  @Column({ nullable: true })
  retentionPercentage: string;

  @Column({ nullable: true })
  penalties: string;

  @Column()
  tenantId: string;

  @Column()
  createdBy: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations will be added when Contract and Notice entities are created
  // @ManyToOne(() => Contract, contract => contract.projects)
  // @JoinColumn({ name: 'contractId' })
  // contract: Contract;

  // @OneToMany(() => Notice, notice => notice.project)
  // notices: Notice[];
}

