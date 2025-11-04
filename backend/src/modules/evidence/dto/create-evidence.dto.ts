import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateEvidenceDto {
  @ApiProperty({ example: 'Site photo - Delayed foundation' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: 's3://bucket/evidence/photo.jpg' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ example: 'image', required: false })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiProperty({ example: 'photo', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'notice-id-123', required: false })
  @IsString()
  @IsOptional()
  noticeId?: string;

  @ApiProperty({ example: 'claim-id-456', required: false })
  @IsString()
  @IsOptional()
  claimId?: string;

  @ApiProperty({ example: ['delay', 'foundation'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'Extracted OCR text', required: false })
  @IsString()
  @IsOptional()
  ocrText?: string;
}

