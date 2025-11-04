import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PdfParseService } from './pdf-parse.service';

@Injectable()
export class OcrService {
  private readonly openaiApiKey: string;

  constructor(
    private configService: ConfigService,
    private pdfParseService: PdfParseService,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  async extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
    return this.pdfParseService.extractText(fileBuffer);
  }

  async extractTextFromImage(fileBuffer: Buffer, mimeType: string): Promise<string> {
    // For now, use OpenAI Vision API for image OCR
    // In production, consider Tesseract.js or cloud OCR services
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const base64Image = fileBuffer.toString('base64');
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this image. Return only the extracted text, no explanations.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content || '';
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async extractTextFromFile(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
  ): Promise<string> {
    if (mimeType === 'application/pdf') {
      return this.extractTextFromPdf(fileBuffer);
    }

    if (mimeType.startsWith('image/')) {
      return this.extractTextFromImage(fileBuffer, mimeType);
    }

    // For other file types, try to extract as text
    return fileBuffer.toString('utf-8');
  }

  async detectClauses(text: string, contractType: string): Promise<string[]> {
    // Use AI to detect clause numbers and references
    // This is a simplified version - in production, use more sophisticated NLP
    const clausePattern = /(?:Clause|clause|§|Section)\s*(\d+[\.\d]*)/gi;
    const matches = text.match(clausePattern);
    return matches ? [...new Set(matches)] : [];
  }
}

