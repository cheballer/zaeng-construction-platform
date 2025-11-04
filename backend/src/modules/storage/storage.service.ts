import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private provider: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>('STORAGE_PROVIDER') || 'hetzner';

    if (this.provider === 'aws') {
      this.s3Client = new S3Client({
        region: this.configService.get<string>('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
          secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
        },
      });
      this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'zaeng-uploads';
    } else {
      // Hetzner Object Storage (S3-compatible)
      this.s3Client = new S3Client({
        endpoint: this.configService.get<string>('HETZNER_ENDPOINT'),
        region: 'fsn1',
        credentials: {
          accessKeyId: this.configService.get<string>('HETZNER_ACCESS_KEY') || '',
          secretAccessKey: this.configService.get<string>('HETZNER_SECRET_KEY') || '',
        },
        forcePathStyle: true,
      });
      this.bucketName = this.configService.get<string>('HETZNER_BUCKET') || 'zaeng-uploads';
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    projectId: string,
  ): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${projectId}/${uuidv4()}${fileExtension}`;
    const contentType = file.mimetype || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: contentType,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);

    return this.getFileUrl(fileName);
  }

  getFileUrl(key: string): string {
    if (this.provider === 'aws') {
      const region = this.configService.get<string>('AWS_REGION');
      return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
    } else {
      const endpoint = this.configService.get<string>('HETZNER_ENDPOINT');
      return `https://${this.bucketName}.${endpoint}/${key}`;
    }
  }

  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const chunks: Uint8Array[] = [];

    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async deleteFile(key: string): Promise<void> {
    // TODO: Implement delete functionality
    // const command = new DeleteObjectCommand({
    //   Bucket: this.bucketName,
    //   Key: key,
    // });
    // await this.s3Client.send(command);
  }
}

