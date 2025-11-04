import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private emailTransporter: any;
  private whatsappApiKey: string;
  private whatsappPhoneNumberId: string;

  constructor(private configService: ConfigService) {
    // Initialize email transporter
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');

    if (smtpHost && smtpUser && smtpPassword) {
      this.emailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
    }

    // Initialize WhatsApp API
    this.whatsappApiKey = this.configService.get<string>('WHATSAPP_API_KEY') || '';
    this.whatsappPhoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
  }

  async sendEmail(to: string, subject: string, body: string, htmlBody?: string) {
    if (!this.emailTransporter) {
      console.warn('Email transporter not configured');
      return { success: false, error: 'Email not configured' };
    }

    try {
      const info = await this.emailTransporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM') || 'noreply@zaeng.co.za',
        to,
        subject,
        text: body,
        html: htmlBody || body,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWhatsApp(to: string, message: string) {
    if (!this.whatsappApiKey || !this.whatsappPhoneNumberId) {
      console.warn('WhatsApp API not configured');
      return { success: false, error: 'WhatsApp not configured' };
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${this.whatsappPhoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''), // Remove non-digits
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.whatsappApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  async sendTimeBarReminder(
    to: string,
    noticeTitle: string,
    deadline: Date,
    channels: string[] = ['email'],
  ) {
    const daysRemaining = Math.ceil(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    const subject = `Time-Bar Reminder: ${noticeTitle}`;
    const message = `Reminder: Notice "${noticeTitle}" has a time-bar deadline in ${daysRemaining} day(s).\n\nDeadline: ${deadline.toLocaleDateString()}\n\nPlease submit the notice before the deadline to ensure compliance.`;

    const htmlMessage = `
      <h2>Time-Bar Reminder</h2>
      <p><strong>Notice:</strong> ${noticeTitle}</p>
      <p><strong>Deadline:</strong> ${deadline.toLocaleDateString()}</p>
      <p><strong>Days Remaining:</strong> ${daysRemaining} day(s)</p>
      <p>Please submit the notice before the deadline to ensure compliance.</p>
    `;

    const results = [];

    if (channels.includes('email')) {
      results.push(await this.sendEmail(to, subject, message, htmlMessage));
    }

    if (channels.includes('whatsapp')) {
      results.push(await this.sendWhatsApp(to, message));
    }

    return results;
  }

  async sendNoticeApprovalRequest(
    to: string,
    noticeTitle: string,
    noticeId: string,
    channels: string[] = ['email'],
  ) {
    const subject = `Notice Approval Required: ${noticeTitle}`;
    const message = `A new notice "${noticeTitle}" requires your approval.\n\nNotice ID: ${noticeId}\n\nPlease review and approve in the system.`;

    const results = [];

    if (channels.includes('email')) {
      results.push(await this.sendEmail(to, subject, message));
    }

    if (channels.includes('whatsapp')) {
      results.push(await this.sendWhatsApp(to, message));
    }

    return results;
  }
}

