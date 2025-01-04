import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly SlideRepository: Repository<Slide>,
  ) {}

  async getAllSlides(): Promise<Slide[]> {
    return this.SlideRepository.find({ cache: false });
  }

  async createSlide(createSlideDto: CreateSlideDto): Promise<Slide> {
    const newSlide = this.SlideRepository.create(createSlideDto);
    return this.SlideRepository.save(newSlide);
  }

  async getSlideById(id: number): Promise<Slide> {
    const Slide = await this.SlideRepository.findOneBy({ id });
    if (!Slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return Slide;
  }

  async updateSlide(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const Slide = await this.SlideRepository.findOneBy({ id });
    if (!Slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    // Удаляем старый файл изображения, если загружено новое
    if (updateSlideDto.path && Slide.path !== updateSlideDto.path) {
      const oldFilePath = path.resolve(Slide.path);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${oldFilePath}`, err);
      }
    }

    // Обновляем данные карточки
    Object.assign(Slide, updateSlideDto);
    return this.SlideRepository.save(Slide);
  }

  async deleteSlide(id: number): Promise<void> {
    const Slide = await this.SlideRepository.findOneBy({ id });
    if (!Slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    // Удаляем файл изображения с диска
    if (Slide.path) {
      const filePath = path.resolve(Slide.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
      }
    }

    // Удаляем запись о карточке из базы данных
    await this.SlideRepository.remove(Slide);
  }
}
