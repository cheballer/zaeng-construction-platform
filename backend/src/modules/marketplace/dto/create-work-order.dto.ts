import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum WorkOrderType {
  LEGAL_ADVISORY = 'legal_advisory',
  PROGRAMME_SUPPORT = 'programme_support',
  QUANTITY_SURVEYING = 'quantity_surveying',
}

export class CreateWorkOrderDto {
  @ApiProperty({ example: 'Legal review of EOT claim' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty({ enum: WorkOrderType })
  @IsEnum(WorkOrderType)
  type: WorkOrderType;

  @ApiProperty({ example: 'expert-id-123' })
  @IsString()
  expertId: string;

  @ApiProperty({ example: 'Need legal review of complex delay claim', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'notice-id-456', required: false })
  @IsString()
  @IsOptional()
  noticeId?: string;

  @ApiProperty({ example: 'claim-id-789', required: false })
  @IsString()
  @IsOptional()
  claimId?: string;
}

