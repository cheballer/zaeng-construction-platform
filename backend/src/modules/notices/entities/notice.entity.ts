import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { NoticeType, NoticeStatus } from '../../../common/enums/contract-type.enum';
import { Claim } from './claim.entity';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  projectId: string;

  @Column({
    type: 'enum',
    enum: NoticeType,
  })
  noticeType: NoticeType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ nullable: true })
  clauseReference: string;

  @Column({ type: 'text', nullable: true })
  aiGeneratedContent: string;

  @Column({
    type: 'enum',
    enum: NoticeStatus,
    default: NoticeStatus.DRAFT,
  })
  status: NoticeStatus;

  @Column({ type: 'date', nullable: true })
  timeBarDeadline: Date;

  @Column({ type: 'date', nullable: true })
  sentAt: Date;

  @Column({ type: 'date', nullable: true })
  acknowledgedAt: Date;

  @Column()
  createdBy: string;

  @Column({ type: 'jsonb', nullable: true })
  recipients: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Claim, (claim) => claim.notice)
  claim: Claim[];
}

