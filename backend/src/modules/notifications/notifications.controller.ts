import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test-email')
  @ApiOperation({ summary: 'Send test email (Admin only)' })
  async testEmail(@Body() body: { to: string; subject: string; message: string }) {
    return this.notificationsService.sendEmail(body.to, body.subject, body.message);
  }

  @Post('test-whatsapp')
  @ApiOperation({ summary: 'Send test WhatsApp (Admin only)' })
  async testWhatsApp(@Body() body: { to: string; message: string }) {
    return this.notificationsService.sendWhatsApp(body.to, body.message);
  }
}

