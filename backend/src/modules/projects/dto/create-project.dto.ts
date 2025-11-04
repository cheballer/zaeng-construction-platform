import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ContractType } from '../../../common/enums/contract-type.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'Athlone Girls High School' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'PROJ-2025-001', required: false })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiProperty({ example: 'ABC Construction (Pty) Ltd' })
  @IsString()
  client: string;

  @ApiProperty({ example: 'Cape Town, Western Cape', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ enum: ContractType, example: ContractType.JBCC })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  completionDate: string;

  @ApiProperty({ example: 5000000, required: false })
  @IsNumber()
  @IsOptional()
  contractValue?: number;

  @ApiProperty({ example: '10%', required: false })
  @IsString()
  @IsOptional()
  retentionPercentage?: string;

  @ApiProperty({ example: 'R5000 per day', required: false })
  @IsString()
  @IsOptional()
  penalties?: string;
}

