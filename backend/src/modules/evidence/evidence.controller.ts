import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('evidence')
@Controller('evidence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EvidenceController {
  constructor(
    private readonly evidenceService: EvidenceService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create evidence record (with file URL)' })
  create(@Body() createEvidenceDto: CreateEvidenceDto, @CurrentUser() user: any) {
    return this.evidenceService.create(createEvidenceDto, user.id);
  }

  @Post('upload/:projectId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload evidence file with OCR processing' })
  @ApiConsumes('multipart/form-data')
  async uploadEvidence(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title?: string; category?: string; noticeId?: string; claimId?: string; tags?: string },
    @CurrentUser() user: any,
  ) {
    // Upload file to storage
    const fileUrl = await this.storageService.uploadFile(
      file,
      'evidence',
      projectId,
    );

    // Create evidence record with OCR
    const createEvidenceDto: CreateEvidenceDto = {
      title: body.title || file.originalname,
      projectId,
      fileUrl,
      fileType: file.mimetype,
      category: body.category,
      noticeId: body.noticeId,
      claimId: body.claimId,
      tags: body.tags ? body.tags.split(',') : [],
    };

    return this.evidenceService.create(createEvidenceDto, user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search evidence by text (OCR content)' })
  async searchEvidence(
    @Query('projectId') projectId: string,
    @Query('query') query: string,
  ) {
    return this.evidenceService.searchByText(projectId, query);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get all evidence for a project' })
  findAll(@Param('projectId') projectId: string) {
    return this.evidenceService.findAll(projectId);
  }

  @Get('notices/:noticeId')
  @ApiOperation({ summary: 'Get evidence linked to a notice' })
  findByNotice(@Param('noticeId') noticeId: string) {
    return this.evidenceService.findByNotice(noticeId);
  }

  @Get('claims/:claimId')
  @ApiOperation({ summary: 'Get evidence linked to a claim' })
  findByClaim(@Param('claimId') claimId: string) {
    return this.evidenceService.findByClaim(claimId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence by ID' })
  findOne(@Param('id') id: string) {
    return this.evidenceService.findOne(id);
  }
}

