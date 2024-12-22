import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/admin.entity';
import { CreateCardsInput } from './dto/create-admin.input';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async createCard(createCardsInput: CreateCardsInput): Promise<Card> {
    const newCard = this.cardRepository.create(createCardsInput);
    return this.cardRepository.save(newCard);
  }

  async getCard(): Promise<Card[]> {
    return this.cardRepository.find();
  }
}
