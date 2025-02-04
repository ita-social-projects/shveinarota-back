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

  async getAllSlides(): Promise<Slide[]> {
    try {
      return await this.slideRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch slides');
    }
  }

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

  async getSlideById(id: number): Promise<Slide> {
    try {
      const slide = await this.slideRepository.findOneBy({ id });
      if (!slide) {
        throw new NotFoundException(`Slide with ID ${id} not found`);
      }
      return slide;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch slide');
    }
  }

  async updateSlide(id: number, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    try {
      const slide = await this.slideRepository.findOneBy({ id });
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

  async deleteSlide(id: number): Promise<void> {
    try {
      const slide = await this.slideRepository.findOneBy({ id });
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