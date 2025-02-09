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

  // Отримання всіх посилань без урахування мови
  async getAllLinks(): Promise<MediaLink[]> {
    try {
      return await this.linkRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Не вдалося отримати список посилань');
    }
  }

  // Отримання посилань для української мови
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
      throw new InternalServerErrorException('Не вдалося отримати посилання українською мовою');
    }
  }

  // Отримання посилань для англійської мови
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
      throw new InternalServerErrorException('Не вдалося отримати посилання англійською мовою');
    }
  }

  // Отримання посилання за ID з урахуванням мови
  async getLinkById(id: number): Promise<MediaLink> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Посилання з ID ${id} не знайдено`);
      }

      // Повертаємо повні дані для обох мов
      return {
        id: link.id,
        path: link.path,
        title: link.title,    // українська
        title_en: link.title_en, // англійська
        url: link.url,
      };
    } catch (error) {
      throw new InternalServerErrorException('Не вдалося отримати посилання');
    }
  }

  // Створення нового посилання
  async createLink(CreateMediaLinkDto: CreateMediaLinkDto): Promise<MediaLink> {
    const newLink = this.linkRepository.create(CreateMediaLinkDto);
    try {
      return await this.linkRepository.save(newLink);
    } catch (error) {
      if (CreateMediaLinkDto.path) {
        this.deleteFile(CreateMediaLinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Посилання з таким URL вже існує');
      }
      throw new InternalServerErrorException('Не вдалося створити посилання');
    }
  }

  // Оновлення посилання
  async updateLink(id: number, UpdateMediaLinkDto: UpdateMediaLinkDto): Promise<MediaLink> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Посилання з ID ${id} не знайдено`);
      }

      // Видаляємо старий файл зображення, якщо завантажено новий
      if (UpdateMediaLinkDto.path && link.path !== UpdateMediaLinkDto.path) {
        this.deleteFile(link.path);
      }

      // Оновлюємо дані посилання
      Object.assign(link, UpdateMediaLinkDto);
      return await this.linkRepository.save(link);
    } catch (error) {
      if (UpdateMediaLinkDto.path) {
        this.deleteFile(UpdateMediaLinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Посилання з таким URL вже існує');
      }
      throw new InternalServerErrorException('Не вдалося оновити посилання');
    }
  }

  // Видалення посилання
  async deleteLink(id: number): Promise<void> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`Посилання з ID ${id} не знайдено`);
      }

      // Видаляємо файл з диска
      if (link.path) {
        this.deleteFile(link.path);
      }

      // Видаляємо запис з бази даних
      await this.linkRepository.remove(link);
    } catch (error) {
      throw new InternalServerErrorException('Не вдалося видалити посилання');
    }
  }

  // Видалення файлу з диска
  private deleteFile(filePath: string): void {
    if (!filePath) return;
    const absolutePath = path.resolve(filePath);
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      console.error(`Помилка видалення файлу: ${absolutePath}`, err);
    }
  }
}
