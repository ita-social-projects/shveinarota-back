import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/links.entity';
import { CreateLinkDto } from './dto/create-links.dto';
import { UpdateLinkDto } from './dto/update-links.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  // Получение всех ссылок без учета языка
  async getAllLinks(): Promise<Link[]> {
    try {
      return await this.linkRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch links');
    }
  }

  // Получение ссылок для украинского языка
  async getUkLinks(): Promise<Link[]> {
    try {
      return this.linkRepository.find({
        select: {
          id: true,
          path: true,
          title: true,
          url: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Ukrainian links');
    }
  }

  // Получение ссылок для английского языка
  async getEnLinks(): Promise<Link[]> {
    try {
      return this.linkRepository.find({
        select: {
          id: true,
          path: true,
          title_en: true,
          url: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch English links');
    }
  }

  // Получение ссылки по ID с учётом языка
  async getLinkById(id: number): Promise<Link> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }
  
      // Возвращаем полные данные для обоих языков
      return {
        id: link.id,
        path: link.path,
        title: link.title,    // украинский
        title_en: link.title_en, // английский
        url: link.url,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch link');
    }
  }
  

  // Создание новой ссылки
  async createLink(createLinkDto: CreateLinkDto): Promise<Link> {
    const newLink = this.linkRepository.create(createLinkDto);
    try {
      return await this.linkRepository.save(newLink);
    } catch (error) {
      if (createLinkDto.path) {
        this.deleteFile(createLinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Link with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to create link');
    }
  }

  // Обновление ссылки
  async updateLink(id: number, updateLinkDto: UpdateLinkDto): Promise<Link> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }

      // Удаляем старый файл изображения, если загружено новое
      if (updateLinkDto.path && link.path !== updateLinkDto.path) {
        this.deleteFile(link.path);
      }

      // Обновляем данные ссылки
      Object.assign(link, updateLinkDto);
      return await this.linkRepository.save(link);
    } catch (error) {
      if (updateLinkDto.path) {
        this.deleteFile(updateLinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Link with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to update link');
    }
  }

  // Удаление ссылки
  async deleteLink(id: number): Promise<void> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }

      // Удаляем файл с диска
      if (link.path) {
        this.deleteFile(link.path);
      }

      // Удаляем запись из базы данных
      await this.linkRepository.remove(link);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete link');
    }
  }

  // Удаление файла с диска
  private deleteFile(filePath: string): void {
    if (!filePath) return;
    const absolutePath = path.resolve(filePath);
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      console.error(`Error deleting file: ${absolutePath}`, err);
    }
  }
}
