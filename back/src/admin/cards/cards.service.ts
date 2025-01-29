import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async getAllCards(): Promise<Card[]> {
    return this.cardRepository.find({ cache: true });
  }

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    if (!createCardDto.path) {
      throw new BadRequestException('Посилання на картинку обовязкове');
    }

    const newCard = this.cardRepository.create(createCardDto);

    try {
      return await this.cardRepository.save(newCard);
    } catch (error) {
      throw new BadRequestException('Помилка при створенні');
    }
  }

  async getCardById(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Карточка з ID ${id} не знайдена`);
    }
    return card;
  }

  async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Карточка з ID ${id} не знайдена`);
    }

    this.cardRepository.merge(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async deleteCard(id: number): Promise<void> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Карточка з ID ${id} не знайдена`);
    }

    await this.cardRepository.remove(card);
  }
}
