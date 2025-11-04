import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('rules')
@Controller('rules')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LEGAL_MANAGER)
@ApiBearerAuth()
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rules (Admin/Legal only)' })
  findAll() {
    return this.rulesService.findAllRules();
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a rule (Admin/Legal only)' })
  createOrUpdate(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.createOrUpdateRule(createRuleDto);
  }

  @Get('calculate/:contractType/:noticeType')
  @ApiOperation({ summary: 'Calculate time-bar deadline' })
  calculateTimeBar(
    @Param('contractType') contractType: string,
    @Param('noticeType') noticeType: string,
    @Body() body: { eventDate: string },
  ) {
    const deadline = this.rulesService.calculateTimeBarDeadline(
      new Date(body.eventDate),
      contractType as any,
      noticeType as any,
    );
    return { deadline: deadline.toISOString() };
  }
}

