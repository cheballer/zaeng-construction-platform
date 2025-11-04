import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { NoticesService } from '../notices/notices.service';
import { EvidenceService } from '../evidence/evidence.service';
import { ProjectsService } from '../projects/projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly noticesService: NoticesService,
    private readonly evidenceService: EvidenceService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('notices/:id/pdf')
  @ApiOperation({ summary: 'Generate notice PDF' })
  async generateNoticePDF(@Param('id') id: string, @Res() res: Response) {
    const notice = await this.noticesService.findOne(id);
    const project = await this.projectsService.findOne(notice.projectId, '');
    const pdf = await this.documentsService.generateNoticePDF(notice, project.name);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="notice-${id}.pdf"`);
    res.send(pdf);
  }

  @Get('claims/:id/pack')
  @ApiOperation({ summary: 'Generate claim pack (ZIP)' })
  async generateClaimPack(@Param('id') id: string, @Res() res: Response) {
    const claim = await this.noticesService.findClaim(id);
    const notice = await this.noticesService.findOne(claim.noticeId || '');
    const evidence = await this.evidenceService.findByClaim(id);
    const project = await this.projectsService.findOne(claim.projectId, '');

    const zip = await this.documentsService.generateClaimPack(
      claim,
      notice,
      evidence,
      project.name,
    );

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="claim-pack-${id}.zip"`);
    res.send(zip);
  }
}

