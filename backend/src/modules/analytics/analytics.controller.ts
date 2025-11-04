import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboard(@CurrentUser() user: any) {
    return this.analyticsService.getDashboardStats(user.tenantId);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get project-specific statistics' })
  async getProjectStats(@Param('projectId') projectId: string) {
    return this.analyticsService.getProjectStats(projectId);
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get time-bar compliance report' })
  async getComplianceReport(
    @Query('projectId') projectId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getTimeBarComplianceReport(
      projectId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}

