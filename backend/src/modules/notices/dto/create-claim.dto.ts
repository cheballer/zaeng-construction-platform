import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ClaimStatus } from '../../../common/enums/contract-type.enum';

export class CreateClaimDto {
  @ApiProperty({ example: 'Extension of Time Claim - Late Drawings' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Delay claim for structural drawings', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 14, required: false })
  @IsNumber()
  @IsOptional()
  daysRequested?: number;

  @ApiProperty({ example: 50000.00, required: false })
  @IsNumber()
  @IsOptional()
  amountRequested?: number;

  @ApiProperty({ enum: ClaimStatus, default: ClaimStatus.DRAFT, required: false })
  @IsEnum(ClaimStatus)
  @IsOptional()
  status?: ClaimStatus;

  @ApiProperty({ example: ['evidence-id-1'], required: false })
  @IsArray()
  @IsOptional()
  evidenceIds?: string[];
}

