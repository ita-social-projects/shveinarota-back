import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly slideRepository: Repository<Slide>,
  ) {}

  // Метод для получения всех слайдов
  async getAllSlides(): Promise<Slide[]> {
    try {
      return await this.slideRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch slides');
    }
  }

  async getUkSlides(): Promise<Slide[]> {
      try {
        return this.slideRepository.find({
          select: {
            id: true,
            path: true,
            title: true,
            text: true
          }
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch Ukrainian Slides');
      }
    }
  
    // Получение ссылок для английского языка
    async getEnSlides(): Promise<Slide[]> {
      try {
        return this.slideRepository.find({
          select: {
            id: true,
            path: true,
            title_en: true,
            text_en: true
          }
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch English Slides');
      }
    }

  // Метод для создания нового слайда
  async createSlide(createSlideDto: CreateSlideDto): Promise<Slide> {
    const newSlide = this.slideRepository.create(createSlideDto);
    try {
      return await this.slideRepository.save(newSlide);
    } catch (error) {
      if (createSlideDto.path) {
        this.deleteFile(createSlideDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Slide with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to create slide');
    }
  }

  // Метод для получения слайда по ID с полной информацией
  async getSlideById(id: number): Promise<Slide> {
    try {
      const slide = await this.slideRepository.findOne({
        where: { id },
      });

      if (!slide) {
        throw new NotFoundException(`Slide with ID ${id} not found`);
      }

      // Возвращаем слайд с полными данными, включая оба языка
      return {
        id: slide.id,
        path: slide.path,
        title: slide.title, // Украинский или основной
        title_en: slide.title_en, // Английский
        text: slide.text, // Украинский или основной
        text_en: slide.text_en, // Английский
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch slide');
    }
  }

  // Метод для обновления слайда по ID
  async updateSlide(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    try {
      const slide = await this.slideRepository.findOne({ where: { id } });
      if (!slide) {
        throw new NotFoundException(`Slide with ID ${id} not found`);
      }

      // Удаляем старый файл изображения, если загружено новое
      if (updateSlideDto.path && slide.path !== updateSlideDto.path) {
        this.deleteFile(slide.path);
      }

      // Обновляем данные слайда
      Object.assign(slide, updateSlideDto);
      return await this.slideRepository.save(slide);
    } catch (error) {
      if (updateSlideDto.path) {
        this.deleteFile(updateSlideDto.path);
      }
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Slide with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to update slide');
    }
  }

  // Метод для удаления слайда по ID
  async deleteSlide(id: number): Promise<void> {
    try {
      const slide = await this.slideRepository.findOne({ where: { id } });
      if (!slide) {
        throw new NotFoundException(`Slide with ID ${id} not found`);
      }

      // Удаляем файл изображения с диска
      if (slide.path) {
        this.deleteFile(slide.path);
      }

      // Удаляем запись о слайде из базы данных
      await this.slideRepository.remove(slide);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete slide');
    }
  }

  // Метод для удаления файла с диска
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
