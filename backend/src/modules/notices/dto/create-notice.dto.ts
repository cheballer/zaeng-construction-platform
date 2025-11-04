import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { NoticeType, NoticeStatus } from '../../../common/enums/contract-type.enum';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Delay due to late drawings' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty({ enum: NoticeType, example: NoticeType.DELAY })
  @IsEnum(NoticeType)
  noticeType: NoticeType;

  @ApiProperty({ example: 'Structural drawings delayed by 2 weeks' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 'Clause 23.1.2', required: false })
  @IsString()
  @IsOptional()
  clauseReference?: string;

  @ApiProperty({ enum: NoticeStatus, default: NoticeStatus.DRAFT, required: false })
  @IsEnum(NoticeStatus)
  @IsOptional()
  status?: NoticeStatus;

  @ApiProperty({ example: ['evidence-id-1', 'evidence-id-2'], required: false })
  @IsArray()
  @IsOptional()
  evidenceIds?: string[];
}

