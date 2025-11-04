import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClaimStatus } from '../../../common/enums/contract-type.enum';
import { Notice } from './notice.entity';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  noticeId: string;

  @Column()
  projectId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  daysRequested: number;

  @Column({ type: 'int', nullable: true })
  daysApproved: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amountRequested: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  amountApproved: number;

  @Column({
    type: 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.DRAFT,
  })
  status: ClaimStatus;

  @Column({ type: 'date', nullable: true })
  sentAt: Date;

  @Column({ type: 'date', nullable: true })
  approvedAt: Date;

  @Column({ type: 'date', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  approvalDocumentUrl: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Notice, (notice) => notice.claim, { nullable: true })
  @JoinColumn({ name: 'noticeId' })
  notice: Notice;
}

