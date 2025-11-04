import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { Clause } from './entities/clause.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { StorageService } from '../storage/storage.service';
import { OcrService } from '../ocr/ocr.service';
import { AiClauseService } from '../ai/ai-clause.service';
import { ContractType } from '../../common/enums/contract-type.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Clause)
    private clausesRepository: Repository<Clause>,
    private storageService: StorageService,
    private ocrService: OcrService,
    private aiClauseService: AiClauseService,
  ) {}

  async create(createContractDto: CreateContractDto, projectId: string): Promise<Contract> {
    const contract = this.contractsRepository.create({
      ...createContractDto,
      projectId,
    });
    return this.contractsRepository.save(contract);
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['project', 'clauses'],
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async findByProject(projectId: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { projectId },
      relations: ['clauses'],
    });
    if (!contract) {
      throw new NotFoundException(`Contract for project ${projectId} not found`);
    }
    return contract;
  }

  // Clause Library Methods
  async findAllClauses(contractType: string): Promise<Clause[]> {
    return this.clausesRepository.find({
      where: { contractType },
      order: { clauseNumber: 'ASC' },
    });
  }

  async findClause(id: string): Promise<Clause> {
    const clause = await this.clausesRepository.findOne({ where: { id } });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    return clause;
  }

  async processContractUpload(
    fileBuffer: Buffer,
    contractType: ContractType,
    projectId: string,
  ): Promise<{ contract: Contract; zClauses: string[] }> {
    // Extract text using OCR
    const ocrText = await this.ocrService.extractTextFromFile(
      fileBuffer,
      'application/pdf',
      'contract.pdf',
    );

    // Detect clauses from OCR text
    const detectedClauses = await this.ocrService.detectClauses(ocrText, contractType);

    // Create contract record
    const contract = this.contractsRepository.create({
      projectId,
      contractType,
      ocrText,
      processed: false,
    });

    const savedContract = await this.contractsRepository.save(contract);

    // Identify Z-clauses (custom clauses not in standard library)
    const standardClauses = await this.findAllClauses(contractType);
    const standardClauseNumbers = new Set(
      standardClauses.map((c) => c.clauseNumber),
    );

    const zClauses = detectedClauses.filter(
      (clause) => !standardClauseNumbers.has(clause.match(/\d+[\.\d]*/)?.[0] || ''),
    );

    return {
      contract: savedContract,
      zClauses,
    };
  }
}

