import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdBy: userId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(tenantId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { tenantId },
      relations: ['contract'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, tenantId },
      relations: ['contract', 'notices'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateData: Partial<CreateProjectDto>, tenantId: string): Promise<Project> {
    const project = await this.findOne(id, tenantId);
    // Convert date strings to Date objects if present
    const processedData: any = { ...updateData };
    if (updateData.startDate && typeof updateData.startDate === 'string') {
      processedData.startDate = new Date(updateData.startDate);
    }
    if (updateData.completionDate && typeof updateData.completionDate === 'string') {
      processedData.completionDate = new Date(updateData.completionDate);
    }
    Object.assign(project, processedData);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const project = await this.findOne(id, tenantId);
    await this.projectsRepository.remove(project);
  }
}

