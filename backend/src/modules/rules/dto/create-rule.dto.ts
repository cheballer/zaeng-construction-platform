import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsArray, IsOptional } from 'class-validator';
import { ContractType, NoticeType } from '../../../common/enums/contract-type.enum';

export class CreateRuleDto {
  @ApiProperty({ enum: ContractType })
  @IsEnum(ContractType)
  contractType: ContractType;

  @ApiProperty({ enum: NoticeType })
  @IsEnum(NoticeType)
  noticeType: NoticeType;

  @ApiProperty({ example: 20 })
  @IsNumber()
  timeBarDays: number;

  @ApiProperty({ example: ['eventDate', 'description', 'mitigation'] })
  @IsArray()
  mandatoryFields: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  workflowStages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  clauseMapping?: Record<string, string>;
}

