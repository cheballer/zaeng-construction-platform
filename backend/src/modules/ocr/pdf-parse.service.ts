import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfParseService {
  async extractText(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF');
    }
  }

  async extractMetadata(pdfBuffer: Buffer): Promise<any> {
    try {
      const data = await pdfParse(pdfBuffer);
      return {
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('PDF metadata extraction error:', error);
      throw new Error('Failed to extract PDF metadata');
    }
  }
}

