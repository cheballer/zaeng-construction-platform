import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { Claim } from './entities/claim.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateClaimDto } from './dto/create-claim.dto';
import { AiClauseService } from '../ai/ai-clause.service';
import { RulesService } from '../rules/rules.service';
import { ProjectsService } from '../projects/projects.service';
import { NoticeStatus } from '../../common/enums/contract-type.enum';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private noticesRepository: Repository<Notice>,
    @InjectRepository(Claim)
    private claimsRepository: Repository<Claim>,
    private aiClauseService: AiClauseService,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createNoticeDto: CreateNoticeDto, userId: string): Promise<Notice> {
    // Get project to determine contract type
    const project = await this.projectsService.findOne(
      createNoticeDto.projectId,
      '',
    );

    // Retrieve relevant clauses using AI
    const relevantClauses = await this.aiClauseService.retrieveRelevantClauses(
      createNoticeDto.description,
      project.contractType,
    );

    // Generate notice draft using AI
    const aiGeneratedContent = await this.aiClauseService.generateNoticeDraft(
      createNoticeDto.description,
      project.contractType,
      createNoticeDto.clauseReference || relevantClauses[0]?.clauseNumber || '',
      createNoticeDto.eventDate,
    );

    // Calculate time-bar deadline using rules engine
    const timeBarDeadline = this.rulesService.calculateTimeBarDeadline(
      new Date(createNoticeDto.eventDate),
      project.contractType,
      createNoticeDto.noticeType,
    );

    // Validate mandatory fields
    const validation = this.rulesService.validateMandatoryFields(
      createNoticeDto,
      project.contractType,
      createNoticeDto.noticeType,
    );

    if (!validation.valid) {
      throw new Error(`Missing mandatory fields: ${validation.missingFields.join(', ')}`);
    }

    const notice = this.noticesRepository.create({
      ...createNoticeDto,
      aiGeneratedContent,
      timeBarDeadline,
      status: createNoticeDto.status || NoticeStatus.DRAFT,
      createdBy: userId,
    });

    const savedNotice = await this.noticesRepository.save(notice);

    // Schedule time-bar reminder if deadline is in the future
    if (timeBarDeadline && timeBarDeadline > new Date()) {
      // Schedule reminder for 3 days before deadline
      const reminderDate = new Date(timeBarDeadline);
      reminderDate.setDate(reminderDate.getDate() - 3);

      // TODO: Use a job queue (Bull/BullMQ) for scheduled reminders
      // For now, we'll send immediate notification if deadline is within 3 days
      const daysUntilDeadline = Math.ceil(
        (timeBarDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilDeadline <= 3) {
        // Send immediate reminder
        // TODO: Get user email from user service
        // await this.notificationsService.sendTimeBarReminder(userEmail, savedNotice.title, timeBarDeadline);
      }
    }

    return savedNotice;
  }

  async updateStatus(id: string, status: NoticeStatus, userId: string): Promise<Notice> {
    const notice = await this.findOne(id);
    const oldStatus = notice.status;

    notice.status = status;

    if (status === NoticeStatus.SENT) {
      notice.sentAt = new Date();
    } else if (status === NoticeStatus.ACKNOWLEDGED) {
      notice.acknowledgedAt = new Date();
    }

    const updatedNotice = await this.noticesRepository.save(notice);

    // Send notifications on status changes
    if (oldStatus !== status) {
      if (status === NoticeStatus.PENDING) {
        // TODO: Notify approvers
        // await this.notificationsService.sendNoticeApprovalRequest(...);
      }
    }

    return updatedNotice;
  }

  async findAll(projectId: string): Promise<Notice[]> {
    return this.noticesRepository.find({
      where: { projectId },
      relations: ['claim'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticesRepository.findOne({
      where: { id },
      relations: ['claim', 'evidence'],
    });
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return notice;
  }

  async update(id: string, updateData: Partial<Notice>): Promise<Notice> {
    await this.noticesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async createClaim(noticeId: string, createClaimDto: CreateClaimDto, userId: string): Promise<Claim> {
    const notice = await this.findOne(noticeId);
    const claim = this.claimsRepository.create({
      ...createClaimDto,
      noticeId: notice.id,
      projectId: notice.projectId,
      createdBy: userId,
    });
    return this.claimsRepository.save(claim);
  }

  async findClaims(projectId: string): Promise<Claim[]> {
    return this.claimsRepository.find({
      where: { projectId },
      relations: ['notice'],
      order: { createdAt: 'DESC' },
    });
  }

  async findClaim(id: string): Promise<Claim> {
    const claim = await this.claimsRepository.findOne({
      where: { id },
      relations: ['notice', 'evidence'],
    });
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return claim;
  }
}

