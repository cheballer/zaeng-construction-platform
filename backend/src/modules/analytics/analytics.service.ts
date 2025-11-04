import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Notice } from '../notices/entities/notice.entity';
import { Claim } from '../notices/entities/claim.entity';
import { Project } from '../projects/entities/project.entity';
import { NoticeStatus, ClaimStatus } from '../../common/enums/contract-type.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Notice)
    private noticesRepository: Repository<Notice>,
    @InjectRepository(Claim)
    private claimsRepository: Repository<Claim>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async getDashboardStats(tenantId: string) {
    const projects = await this.projectsRepository.find({
      where: { tenantId },
    });
    const projectIds = projects.map((p) => p.id);

    const [
      totalNotices,
      draftNotices,
      pendingNotices,
      overdueNotices,
      totalClaims,
      approvedClaims,
      rejectedClaims,
      pendingClaims,
    ] = await Promise.all([
      this.noticesRepository
        .createQueryBuilder('notice')
        .where('notice.projectId IN (:...projectIds)', { projectIds })
        .getCount(),
      this.noticesRepository
        .createQueryBuilder('notice')
        .where('notice.projectId IN (:...projectIds)', { projectIds })
        .andWhere('notice.status = :status', { status: NoticeStatus.DRAFT })
        .getCount(),
      this.noticesRepository
        .createQueryBuilder('notice')
        .where('notice.projectId IN (:...projectIds)', { projectIds })
        .andWhere('notice.status = :status', { status: NoticeStatus.PENDING })
        .getCount(),
      this.getOverdueNoticesCount(projectIds),
      this.claimsRepository
        .createQueryBuilder('claim')
        .where('claim.projectId IN (:...projectIds)', { projectIds })
        .getCount(),
      this.claimsRepository
        .createQueryBuilder('claim')
        .where('claim.projectId IN (:...projectIds)', { projectIds })
        .andWhere('claim.status = :status', { status: ClaimStatus.APPROVED })
        .getCount(),
      this.claimsRepository
        .createQueryBuilder('claim')
        .where('claim.projectId IN (:...projectIds)', { projectIds })
        .andWhere('claim.status = :status', { status: ClaimStatus.REJECTED })
        .getCount(),
      this.claimsRepository
        .createQueryBuilder('claim')
        .where('claim.projectId IN (:...projectIds)', { projectIds })
        .andWhere('claim.status = :status', { status: ClaimStatus.PENDING })
        .getCount(),
    ]);

    // Calculate time-bar compliance rate
    const noticesWithDeadlines = await this.noticesRepository
      .createQueryBuilder('notice')
      .where('notice.projectId IN (:...projectIds)', { projectIds })
      .select(['notice.id', 'notice.timeBarDeadline', 'notice.sentAt', 'notice.status'])
      .getMany();

    const compliantNotices = noticesWithDeadlines.filter((notice) => {
      if (!notice.timeBarDeadline || !notice.sentAt) return false;
      return new Date(notice.sentAt) <= new Date(notice.timeBarDeadline);
    }).length;

    const complianceRate =
      noticesWithDeadlines.length > 0
        ? (compliantNotices / noticesWithDeadlines.length) * 100
        : 100;

    // Calculate average EOT days claimed vs awarded
    const claims = await this.claimsRepository
      .createQueryBuilder('claim')
      .where('claim.projectId IN (:...projectIds)', { projectIds })
      .select(['claim.daysRequested', 'claim.daysApproved'])
      .getMany();

    const totalDaysRequested = claims.reduce(
      (sum, claim) => sum + (claim.daysRequested || 0),
      0,
    );
    const totalDaysApproved = claims.reduce(
      (sum, claim) => sum + (claim.daysApproved || 0),
      0,
    );
    const avgDaysRequested =
      claims.length > 0 ? totalDaysRequested / claims.length : 0;
    const avgDaysApproved =
      claims.length > 0 ? totalDaysApproved / claims.length : 0;

    return {
      projects: {
        total: projects.length,
        active: projects.filter((p) => p.status === 'active').length,
      },
      notices: {
        total: totalNotices,
        draft: draftNotices,
        pending: pendingNotices,
        overdue: overdueNotices,
        complianceRate: Math.round(complianceRate * 100) / 100,
      },
      claims: {
        total: totalClaims,
        approved: approvedClaims,
        rejected: rejectedClaims,
        pending: pendingClaims,
        approvalRate:
          totalClaims > 0
            ? Math.round((approvedClaims / totalClaims) * 100 * 100) / 100
            : 0,
      },
      eot: {
        avgDaysRequested: Math.round(avgDaysRequested * 100) / 100,
        avgDaysApproved: Math.round(avgDaysApproved * 100) / 100,
        successRate:
          totalDaysRequested > 0
            ? Math.round((totalDaysApproved / totalDaysRequested) * 100 * 100) /
              100
            : 0,
      },
    };
  }

  async getProjectStats(projectId: string) {
    const [notices, claims] = await Promise.all([
      this.noticesRepository.find({ where: { projectId } }),
      this.claimsRepository.find({ where: { projectId } }),
    ]);

    const overdueNotices = notices.filter((notice) => {
      if (!notice.timeBarDeadline) return false;
      return new Date() > new Date(notice.timeBarDeadline) && notice.status !== NoticeStatus.SENT;
    });

    return {
      notices: {
        total: notices.length,
        byStatus: this.groupByStatus(notices, 'status'),
        overdue: overdueNotices.length,
      },
      claims: {
        total: claims.length,
        byStatus: this.groupByStatus(claims, 'status'),
      },
    };
  }

  async getTimeBarComplianceReport(projectId?: string, startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (projectId) {
      where.projectId = projectId;
    }
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    }

    const notices = await this.noticesRepository.find({
      where,
      select: ['id', 'timeBarDeadline', 'sentAt', 'status', 'createdAt'],
    });

    const compliant = notices.filter(
      (n) => n.sentAt && n.timeBarDeadline && new Date(n.sentAt) <= new Date(n.timeBarDeadline),
    );
    const nonCompliant = notices.filter(
      (n) => n.sentAt && n.timeBarDeadline && new Date(n.sentAt) > new Date(n.timeBarDeadline),
    );
    const pending = notices.filter((n) => !n.sentAt && n.timeBarDeadline && new Date() <= new Date(n.timeBarDeadline));
    const overdue = notices.filter((n) => !n.sentAt && n.timeBarDeadline && new Date() > new Date(n.timeBarDeadline));

    return {
      total: notices.length,
      compliant: compliant.length,
      nonCompliant: nonCompliant.length,
      pending: pending.length,
      overdue: overdue.length,
      complianceRate: notices.length > 0 ? (compliant.length / notices.length) * 100 : 100,
      details: {
        compliant,
        nonCompliant,
        pending,
        overdue,
      },
    };
  }

  private async getOverdueNoticesCount(projectIds: string[]): Promise<number> {
    const notices = await this.noticesRepository
      .createQueryBuilder('notice')
      .where('notice.projectId IN (:...projectIds)', { projectIds })
      .select(['notice.id', 'notice.timeBarDeadline', 'notice.status'])
      .getMany();

    return notices.filter((notice) => {
      if (!notice.timeBarDeadline || notice.status === NoticeStatus.SENT) return false;
      return new Date() > new Date(notice.timeBarDeadline);
    }).length;
  }

  private groupByStatus(items: any[], statusField: string): Record<string, number> {
    return items.reduce((acc, item) => {
      const status = item[statusField];
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }
}

