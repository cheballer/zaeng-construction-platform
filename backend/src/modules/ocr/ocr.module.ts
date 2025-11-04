import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { PdfParseService } from './pdf-parse.service';

@Module({
  providers: [OcrService, PdfParseService],
  exports: [OcrService, PdfParseService],
})
export class OcrModule {}

