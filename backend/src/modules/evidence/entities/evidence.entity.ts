import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('evidence')
export class Evidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  projectId: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileType: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  noticeId: string;

  @Column({ nullable: true })
  claimId: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  ocrText: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

