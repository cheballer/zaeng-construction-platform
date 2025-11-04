import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('notices')
@Controller('notices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notice' })
  create(@Body() createNoticeDto: CreateNoticeDto, @CurrentUser() user: any) {
    return this.noticesService.create(createNoticeDto, user.id);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get all notices for a project' })
  findAll(@Param('projectId') projectId: string) {
    return this.noticesService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notice by ID' })
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notice' })
  update(@Param('id') id: string, @Body() updateData: Partial<CreateNoticeDto>) {
    return this.noticesService.update(id, updateData);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update notice status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser() user: any,
  ) {
    return this.noticesService.updateStatus(id, body.status as any, user.id);
  }

  @Post(':noticeId/claims')
  @ApiOperation({ summary: 'Create a claim from a notice' })
  createClaim(
    @Param('noticeId') noticeId: string,
    @Body() createClaimDto: CreateClaimDto,
    @CurrentUser() user: any,
  ) {
    return this.noticesService.createClaim(noticeId, createClaimDto, user.id);
  }

  @Get('projects/:projectId/claims')
  @ApiOperation({ summary: 'Get all claims for a project' })
  findClaims(@Param('projectId') projectId: string) {
    return this.noticesService.findClaims(projectId);
  }

  @Get('claims/:id')
  @ApiOperation({ summary: 'Get claim by ID' })
  findClaim(@Param('id') id: string) {
    return this.noticesService.findClaim(id);
  }
}

