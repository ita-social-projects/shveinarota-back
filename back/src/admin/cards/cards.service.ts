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

  // Отримати всі картки
  async getAllCards(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  // Отримати всі картки українською мовою
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

  // Отримати всі картки англійською мовою
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

  // Отримати картку за ID
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

  // Створити нову картку
  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    const newCard = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(newCard);
  }

  // ========================
  // PUT запити
  // ========================

  // Оновити картку за ID
  async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    // Оновлюємо дані картки
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  // ========================
  // DELETE запити
  // ========================

  // Видалити картку за ID
  async deleteCard(id: number): Promise<void> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    // Видаляємо файл зображення, якщо він існує
    if (card.path) {
      const filePath = path.resolve(card.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Помилка при видаленні файлу: ${filePath}`, err);
      }
    }

    // Видаляємо запис картки з бази даних
    await this.cardRepository.remove(card);
  }
}