import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expert } from './expert.entity';

export enum WorkOrderStatus {
  PENDING = 'pending',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  projectId: string;

  @Column()
  type: string;

  @Column()
  expertId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  noticeId: string;

  @Column({ nullable: true })
  claimId: string;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.PENDING,
  })
  status: WorkOrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quotedAmount: number;

  @Column()
  requestedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Expert)
  @JoinColumn({ name: 'expertId' })
  expert: Expert;
}

