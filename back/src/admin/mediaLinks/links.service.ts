import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/links.entity';
import { CreatelinkDto } from './dto/create-links.dto';
import { UpdatelinkDto } from './dto/update-links.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class linksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async getAlllinks(): Promise<Link[]> {
    try {
      return await this.linkRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch links');
    }
  }

  async createlink(createlinkDto: CreatelinkDto): Promise<Link> {
    const newlink = this.linkRepository.create(createlinkDto);
    try {
      return await this.linkRepository.save(newlink);
    } catch (error) {
      if (createlinkDto.path) {
        this.deleteFile(createlinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Link with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to create link');
    }
  }

  async getlinkById(id: number): Promise<Link> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`link with ID ${id} not found`);
      }
      return link;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch link');
    }
  }

  async updatelink(id: number, updatelinkDto: UpdatelinkDto): Promise<Link> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`link with ID ${id} not found`);
      }

      // Удаляем старый файл изображения, если загружено новое
      if (updatelinkDto.path && link.path !== updatelinkDto.path) {
        this.deleteFile(link.path);
      }

      // Обновляем данные карточки
      Object.assign(link, updatelinkDto);
      return await this.linkRepository.save(link);
    } catch (error) {
      if (updatelinkDto.path) {
        this.deleteFile(updatelinkDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Link with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to update link');
    }
  }

  async deletelink(id: number): Promise<void> {
    try {
      const link = await this.linkRepository.findOneBy({ id });
      if (!link) {
        throw new NotFoundException(`link with ID ${id} not found`);
      }

      // Удаляем файл изображения с диска
      if (link.path) {
        this.deleteFile(link.path);
      }

      // Удаляем запись о links из базы данных
      await this.linkRepository.remove(link);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete link');
    }
  }

  private deleteFile(filePath: string): void {
    if (!filePath) return;
    const absolutePath = path.resolve(filePath);
    try {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      console.error(`Ошибка при удалении файла: ${absolutePath}`, err);
    }
  }
}
