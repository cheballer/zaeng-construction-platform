import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('experts')
  @ApiOperation({ summary: 'Get all available experts' })
  findAllExperts() {
    return this.marketplaceService.findAllExperts();
  }

  @Get('experts/:id')
  @ApiOperation({ summary: 'Get expert by ID' })
  findExpert(@Param('id') id: string) {
    return this.marketplaceService.findExpert(id);
  }

  @Post('work-orders')
  @ApiOperation({ summary: 'Create a work order request' })
  createWorkOrder(@Body() createWorkOrderDto: CreateWorkOrderDto, @CurrentUser() user: any) {
    return this.marketplaceService.createWorkOrder(createWorkOrderDto, user.id);
  }

  @Get('work-orders')
  @ApiOperation({ summary: 'Get all work orders for current user' })
  findWorkOrders(@CurrentUser() user: any) {
    return this.marketplaceService.findWorkOrders(user.id);
  }
}

