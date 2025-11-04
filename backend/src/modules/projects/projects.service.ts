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

  async update(id: string, updateData: Partial<Project>, tenantId: string): Promise<Project> {
    const project = await this.findOne(id, tenantId);
    Object.assign(project, updateData);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const project = await this.findOne(id, tenantId);
    await this.projectsRepository.remove(project);
  }
}

