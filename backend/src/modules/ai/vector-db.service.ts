import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class VectorDbService implements OnModuleInit {
  private pinecone: any;
  private index: any;
  private openaiApiKey: string;
  private provider: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>('VECTOR_DB_PROVIDER') || 'pinecone';
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  async onModuleInit() {
    if (this.provider === 'pinecone' && this.openaiApiKey) {
      const apiKey = this.configService.get<string>('PINECONE_API_KEY');
      if (apiKey) {
        this.pinecone = new Pinecone({ apiKey });
        const indexName = this.configService.get<string>('PINECONE_INDEX') || 'zaeng-clauses';
        this.index = this.pinecone.index(indexName);
      }
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  async upsertClause(clauseId: string, text: string, metadata: any): Promise<void> {
    if (!this.index) {
      console.warn('Vector database not initialized, skipping upsert');
      return;
    }

    const embedding = await this.createEmbedding(text);
    await this.index.upsert([
      {
        id: clauseId,
        values: embedding,
        metadata: {
          ...metadata,
          text: text.substring(0, 1000), // Store first 1000 chars
        },
      },
    ]);
  }

  async searchSimilarClauses(
    query: string,
    contractType: string,
    topK: number = 5,
  ): Promise<any[]> {
    if (!this.index) {
      console.warn('Vector database not initialized, returning empty results');
      return [];
    }

    const queryEmbedding = await this.createEmbedding(query);

    const results = await this.index.query({
      vector: queryEmbedding,
      topK,
      filter: {
        contractType: { $eq: contractType },
      },
      includeMetadata: true,
    });

    return results.matches || [];
  }

  async deleteClause(clauseId: string): Promise<void> {
    if (!this.index) {
      return;
    }

    await this.index.deleteOne(clauseId);
  }
}

