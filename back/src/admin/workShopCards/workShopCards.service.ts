import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { workShopCards } from './entities/workShopCards.entity';
import { CreateWorkShopCardsDto } from './dto/create-workShopCards.dto';
import { UpdateWorkShopCardsDto } from './dto/update-workShopCards.dto';

@Injectable()
export class WorkShopCardsService {
  constructor(
    @InjectRepository(workShopCards)
    private readonly cardsRepository: Repository<workShopCards>,
  ) {}

  // ========================
  // GET запити
  // ========================

  async getAllCards(): Promise<workShopCards[]> {
    return this.cardsRepository.find();
  }

  async getUkCards(): Promise<workShopCards[]> {
    return this.cardsRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        schedule: true,
        link: true,
      },
    });
  }

  async getEnCards(): Promise<workShopCards[]> {
    return this.cardsRepository.find({
      select: {
        id: true,
        title_en: true,
        description_en: true,
        schedule: true,
        link: true,
      },
    });
  }

  async getCardById(id: number): Promise<workShopCards> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }
    return card;
  }

  // ========================
  // POST запити
  // ========================

  async createCard(dto: CreateWorkShopCardsDto): Promise<workShopCards> {
    const newCard = this.cardsRepository.create(dto);
    return this.cardsRepository.save(newCard);
  }

  // ========================
  // PUT запити
  // ========================

  async updateCard(
    id: number,
    dto: UpdateWorkShopCardsDto,
  ): Promise<workShopCards> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    Object.assign(card, dto);
    return this.cardsRepository.save(card);
  }

  // ========================
  // DELETE запити
  // ========================

  async deleteCard(id: number): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }
    await this.cardsRepository.remove(card);
  }
}
