import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { link } from './entities/links.entity';
import { CreatelinkDto } from './dto/create-links.dto';
import { UpdatelinkDto } from './dto/update-links.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class linksService {
  constructor(
    @InjectRepository(link)
    private readonly linkRepository: Repository<link>,
  ) {}

  async getAlllinks(): Promise<link[]> {
    return this.linkRepository.find({ cache: false });
  }

  async createlink(createlinkDto: CreatelinkDto): Promise<link> {
    const newlink = this.linkRepository.create(createlinkDto);
    return this.linkRepository.save(newlink);
  }

  async getlinkById(id: number): Promise<link> {
    const link = await this.linkRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`link with ID ${id} not found`);
    }
    return link;
  }

  async updatelink(id: number, updatelinkDto: UpdatelinkDto): Promise<link> {
    const link = await this.linkRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`link with ID ${id} not found`);
    }

    // Удаляем старый файл изображения, если загружено новое
    if (updatelinkDto.path && link.path !== updatelinkDto.path) {
      const oldFilePath = path.resolve(link.path);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${oldFilePath}`, err);
      }
    }

    // Обновляем данные карточки
    Object.assign(link, updatelinkDto);
    return this.linkRepository.save(link);
  }

  async deletelink(id: number): Promise<void> {
    const link = await this.linkRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`link with ID ${id} not found`);
    }

    // Удаляем файл изображения с диска
    if (link.path) {
      const filePath = path.resolve(link.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
      }
    }

    // Удаляем запись о links из базы данных
    await this.linkRepository.remove(link);
  }
}
