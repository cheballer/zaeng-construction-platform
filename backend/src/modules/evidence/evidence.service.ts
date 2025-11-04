import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidence } from './entities/evidence.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { StorageService } from '../storage/storage.service';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectRepository(Evidence)
    private evidenceRepository: Repository<Evidence>,
    private storageService: StorageService,
    private ocrService: OcrService,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto, userId: string): Promise<Evidence> {
    // Extract OCR text if file URL is provided
    let ocrText = createEvidenceDto.ocrText;
    if (createEvidenceDto.fileUrl && !ocrText) {
      try {
        // Download file and extract text
        const fileBuffer = await this.storageService.getFile(
          this.extractKeyFromUrl(createEvidenceDto.fileUrl),
        );
        const mimeType = createEvidenceDto.fileType || 'application/pdf';
        ocrText = await this.ocrService.extractTextFromFile(
          fileBuffer,
          mimeType,
          createEvidenceDto.title,
        );
      } catch (error) {
        console.error('OCR extraction failed:', error);
        // Continue without OCR text
      }
    }

    const evidence = this.evidenceRepository.create({
      ...createEvidenceDto,
      ocrText,
      uploadedBy: userId,
    });
    return this.evidenceRepository.save(evidence);
  }

  private extractKeyFromUrl(url: string): string {
    // Extract key from S3/Hetzner URL
    const urlParts = url.split('/');
    // Remove domain and bucket, get the key
    const keyIndex = urlParts.findIndex((part) => part.includes('contracts') || part.includes('evidence'));
    if (keyIndex !== -1) {
      return urlParts.slice(keyIndex).join('/');
    }
    return urlParts[urlParts.length - 1];
  }

  async findAll(projectId: string): Promise<Evidence[]> {
    return this.evidenceRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Evidence> {
    const evidence = await this.evidenceRepository.findOne({ where: { id } });
    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }
    return evidence;
  }

  async findByNotice(noticeId: string): Promise<Evidence[]> {
    return this.evidenceRepository.find({
      where: { noticeId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByClaim(claimId: string): Promise<Evidence[]> {
    return this.evidenceRepository.find({
      where: { claimId },
      order: { createdAt: 'DESC' },
    });
  }

  async searchByText(projectId: string, query: string): Promise<Evidence[]> {
    // Search in OCR text and title
    return this.evidenceRepository
      .createQueryBuilder('evidence')
      .where('evidence.projectId = :projectId', { projectId })
      .andWhere(
        '(evidence.title ILIKE :query OR evidence.ocrText ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('evidence.createdAt', 'DESC')
      .getMany();
  }
}

