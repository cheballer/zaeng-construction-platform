import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { VectorDbService } from './vector-db.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clause } from '../contracts/entities/clause.entity';

@Injectable()
export class AiClauseService {
  private readonly openaiApiKey: string;

  constructor(
    private configService: ConfigService,
    private vectorDbService: VectorDbService,
    @InjectRepository(Clause)
    private clauseRepository: Repository<Clause>,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  async retrieveRelevantClauses(
    eventDescription: string,
    contractType: string,
  ): Promise<Clause[]> {
    // Search vector database for similar clauses
    const similarClauses = await this.vectorDbService.searchSimilarClauses(
      eventDescription,
      contractType,
      5,
    );

    // Fetch full clause details from database
    const clauseIds = similarClauses.map((match) => match.id);
    if (clauseIds.length === 0) {
      return [];
    }

    return this.clauseRepository.find({
      where: clauseIds.map((id) => ({ id })),
    });
  }

  async generateNoticeDraft(
    eventDescription: string,
    contractType: string,
    clauseReference: string,
    eventDate: string,
  ): Promise<string> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Retrieve relevant clauses
    const relevantClauses = await this.retrieveRelevantClauses(
      eventDescription,
      contractType,
    );

    const clauseContext = relevantClauses
      .map((clause) => `Clause ${clause.clauseNumber}: ${clause.summary || clause.content.substring(0, 200)}`)
      .join('\n\n');

    const prompt = `You are a legal assistant drafting a construction contract notice. 

Event Description: ${eventDescription}
Contract Type: ${contractType}
Relevant Clause: ${clauseReference}
Event Date: ${eventDate}

Relevant Clauses:
${clauseContext}

Draft a formal, compliant notice for this event. The notice should:
1. Reference the appropriate clause number
2. Clearly describe the event
3. Include the event date
4. Be professional and legally sound
5. Follow standard construction contract notice format

Return only the notice text, no explanations.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are a legal assistant specializing in construction contracts. Draft clear, compliant notices.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
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
      console.error('AI notice generation error:', error);
      throw new Error('Failed to generate notice draft');
    }
  }

  async indexClause(clause: Clause): Promise<void> {
    // Create embedding and store in vector database
    const textToEmbed = `${clause.clauseNumber} ${clause.title} ${clause.content} ${clause.summary || ''}`;
    await this.vectorDbService.upsertClause(clause.id, textToEmbed, {
      contractType: clause.contractType,
      clauseNumber: clause.clauseNumber,
      title: clause.title,
    });
  }
}

