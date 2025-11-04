import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('projects/:projectId/notice-register')
  getNoticeRegister(@Param('projectId') projectId: string) {
    return this.reportsService.generateNoticeRegister(projectId);
  }

  @Get('projects/:projectId/compliance')
  getComplianceReport(@Param('projectId') projectId: string) {
    return this.reportsService.generateComplianceReport(projectId);
  }
}

