import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly storageService: StorageService,
  ) {}

  @Post('projects/:projectId')
  @ApiOperation({ summary: 'Upload contract for a project (JSON)' })
  create(
    @Param('projectId') projectId: string,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsService.create(createContractDto, projectId);
  }

  @Post('projects/:projectId/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload and process contract file' })
  @ApiConsumes('multipart/form-data')
  async uploadContract(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { contractType: string },
    @CurrentUser() user: any,
  ) {
    // Upload file to storage
    const fileUrl = await this.storageService.uploadFile(
      file,
      'contracts',
      projectId,
    );

    // Process contract with OCR
    const result = await this.contractsService.processContractUpload(
      file.buffer,
      body.contractType as any,
      projectId,
    );

    // Update contract with file URL
    result.contract.fileUrl = fileUrl;
    await this.contractsService['contractsRepository'].save(result.contract);

    return {
      contract: result.contract,
      zClauses: result.zClauses,
      fileUrl,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by ID' })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get contract for a project' })
  findByProject(@Param('projectId') projectId: string) {
    return this.contractsService.findByProject(projectId);
  }

  @Get('clauses/:contractType')
  @ApiOperation({ summary: 'Get all clauses for a contract type' })
  findAllClauses(@Param('contractType') contractType: string) {
    return this.contractsService.findAllClauses(contractType);
  }

  @Get('clauses/:contractType/:id')
  @ApiOperation({ summary: 'Get specific clause' })
  findClause(@Param('id') id: string) {
    return this.contractsService.findClause(id);
  }
}

