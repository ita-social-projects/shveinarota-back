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

  async getAllCards(): Promise<Card[]> {
    return this.cardRepository.find({ cache: false });
  }

  async createCard(createCardDto: CreateCardDto): Promise<Card> {
    if (!createCardDto.path) {
      throw new BadRequestException('Путь к изображению 2312обязателен');
    }

    const newCard = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(newCard);
  }

  async getCardById(id: number): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }
    return card;
  }

  async updateCard(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    // Если загружен новый файл, удаляем старый файл
    if (updateCardDto.path && updateCardDto.path !== card.path) {
      const oldFilePath = path.resolve(card.path);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${oldFilePath}`, err);
      }
    }

    // Обновляем данные карточки
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async deleteCard(id: number): Promise<void> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    // Удаляем файл изображения, если он существует
    if (card.path) {
      const filePath = path.resolve(card.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
      }
    }

    // Удаляем запись о карточке из базы данных
    await this.cardRepository.remove(card);
  }
}
