import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { ContractType, NoticeType } from '../../common/enums/contract-type.enum';
import { addBusinessDays, isWeekend, format } from 'date-fns';
import { enZA } from 'date-fns/locale';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
  ) {}

  async findRule(contractType: ContractType, noticeType: NoticeType): Promise<Rule> {
    const rule = await this.rulesRepository.findOne({
      where: { contractType, noticeType },
    });

    if (!rule) {
      // Return default rule if not found
      return this.getDefaultRule(contractType, noticeType);
    }

    return rule;
  }

  async createOrUpdateRule(ruleData: Partial<Rule>): Promise<Rule> {
    let rule = await this.rulesRepository.findOne({
      where: {
        contractType: ruleData.contractType,
        noticeType: ruleData.noticeType,
      },
    });

    if (rule) {
      Object.assign(rule, ruleData);
    } else {
      rule = this.rulesRepository.create(ruleData);
    }

    return this.rulesRepository.save(rule);
  }

  calculateTimeBarDeadline(
    eventDate: Date,
    contractType: ContractType,
    noticeType: NoticeType,
    workingCalendar?: any,
  ): Date {
    const rule = this.getDefaultRule(contractType, noticeType);
    const timeBarDays = rule.timeBarDays || 20;

    // Calculate deadline considering working days only
    let currentDate = new Date(eventDate);
    let daysCounted = 0;

    while (daysCounted < timeBarDays) {
      currentDate = addBusinessDays(currentDate, 1);

      // Check if it's a working day (not weekend)
      if (!isWeekend(currentDate)) {
        // TODO: Check against working calendar for public holidays
        daysCounted++;
      }
    }

    return currentDate;
  }

  validateMandatoryFields(
    noticeData: any,
    contractType: ContractType,
    noticeType: NoticeType,
  ): { valid: boolean; missingFields: string[] } {
    const rule = this.getDefaultRule(contractType, noticeType);
    const mandatoryFields = rule.mandatoryFields || [];

    const missingFields = mandatoryFields.filter((field) => !noticeData[field]);

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }

  private getDefaultRule(contractType: ContractType, noticeType: NoticeType): Rule {
    // Default rules based on contract types
    const defaultRules: Record<string, Partial<Rule>> = {
      'jbcc-delay': {
        contractType: ContractType.JBCC,
        noticeType: NoticeType.DELAY,
        timeBarDays: 20,
        mandatoryFields: ['eventDate', 'description', 'mitigation'],
      },
      'jbcc-extension_of_time': {
        contractType: ContractType.JBCC,
        noticeType: NoticeType.EXTENSION_OF_TIME,
        timeBarDays: 20,
        mandatoryFields: ['eventDate', 'description', 'daysRequested'],
      },
      'nec-compensation_event': {
        contractType: ContractType.NEC,
        noticeType: NoticeType.VARIATION,
        timeBarDays: 8,
        mandatoryFields: ['eventDate', 'description'],
      },
    };

    const key = `${contractType}-${noticeType}`;
    const defaultRule = defaultRules[key] || {
      contractType,
      noticeType,
      timeBarDays: 20,
      mandatoryFields: ['eventDate', 'description'],
    };

    const rule = new Rule();
    Object.assign(rule, defaultRule);
    return rule;
  }

  async findAllRules(): Promise<Rule[]> {
    return this.rulesRepository.find({
      order: { contractType: 'ASC', noticeType: 'ASC' },
    });
  }
}

