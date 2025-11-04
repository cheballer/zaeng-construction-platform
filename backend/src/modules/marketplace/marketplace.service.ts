import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expert } from './entities/expert.entity';
import { WorkOrder } from './entities/work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Expert)
    private expertsRepository: Repository<Expert>,
    @InjectRepository(WorkOrder)
    private workOrdersRepository: Repository<WorkOrder>,
  ) {}

  async findAllExperts(): Promise<Expert[]> {
    return this.expertsRepository.find({
      where: { active: true },
      order: { rating: 'DESC' },
    });
  }

  async findExpert(id: string): Promise<Expert> {
    const expert = await this.expertsRepository.findOne({ where: { id } });
    if (!expert) {
      throw new NotFoundException(`Expert with ID ${id} not found`);
    }
    return expert;
  }

  async createWorkOrder(createWorkOrderDto: CreateWorkOrderDto, userId: string): Promise<WorkOrder> {
    const workOrder = this.workOrdersRepository.create({
      ...createWorkOrderDto,
      requestedBy: userId,
    });
    return this.workOrdersRepository.save(workOrder);
  }

  async findWorkOrders(userId: string): Promise<WorkOrder[]> {
    return this.workOrdersRepository.find({
      where: { requestedBy: userId },
      relations: ['expert'],
      order: { createdAt: 'DESC' },
    });
  }
}

