import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  // ========================
  // GET запити
  // ========================

 
  async getAllCards(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  async getUkCards(): Promise<Card[]> {
    return this.cardRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        path: true
      }
    });
  }

  async getEnCards(): Promise<Card[]> {
    return this.cardRepository.find({
      select: {
        id: true,
        title_en: true,
        description_en: true,
        path: true
      }
    });
  }

  async getCardById(id: number): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }
    return card;
  }

  // ========================
  // POST запити
  // ========================

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const newCard = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(newCard);
  }

  // ========================
  // PUT запити
  // ========================

  async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  // ========================
  // DELETE запити
  // ========================

  async deleteCard(id: number): Promise<void> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    await this.cardRepository.remove(card);
  }
}