import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ContractType } from '../../../common/enums/contract-type.enum';

export class CreateContractDto {
  @ApiProperty({ enum: ContractType, example: ContractType.JBCC })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty({ example: 'JBCC 2020', required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ example: 's3://bucket/contract.pdf', required: false })
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({ example: 'Contract signed on 2025-01-15', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

