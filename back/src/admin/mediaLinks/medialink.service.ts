import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaLink } from './entities/medialink.entity';
import { CreateMediaLinkDto } from './dto/create-medialink.dto';
import { UpdateMediaLinkDto } from './dto/update-medialink.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(MediaLink)
    private readonly linkRepository: Repository<MediaLink>,
  ) {}

  // Получение всех ссылок без учета языка
  async getAllLinks(): Promise<MediaLink[]> {
    try {
      return await this.linkRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch links');
    }
  }

  // Получение ссылок для украинского языка
  async getUkLinks(): Promise<MediaLink[]> {
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
  async getEnLinks(): Promise<MediaLink[]> {
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
  async getLinkById(id: number): Promise<MediaLink> {
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
  async createLink(CreateMediaLinkDto: CreateMediaLinkDto): Promise<MediaLink> {
    const newLink = this.linkRepository.create(CreateMediaLinkDto);
    try {
      return await this.linkRepository.save(newLink);
    } catch (error) {
      if (CreateMediaLinkDto.path) {
        this.deleteFile(CreateMediaLinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Link with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to create link');
    }
  }

  // Обновление ссылки
  async updateLink(id: number, UpdateMediaLinkDto: UpdateMediaLinkDto): Promise<MediaLink> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Link with ID ${id} not found`);
      }

      // Удаляем старый файл изображения, если загружено новое
      if (UpdateMediaLinkDto.path && link.path !== UpdateMediaLinkDto.path) {
        this.deleteFile(link.path);
      }

      // Обновляем данные ссылки
      Object.assign(link, UpdateMediaLinkDto);
      return await this.linkRepository.save(link);
    } catch (error) {
      if (UpdateMediaLinkDto.path) {
        this.deleteFile(UpdateMediaLinkDto.path);
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
