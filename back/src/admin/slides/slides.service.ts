import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly SlidesRepository: Repository<Slide>,
  ) {}

  async getAllSlides(): Promise<Slide[]> {
    return this.SlidesRepository.find({ cache: true });
  }

  async createSlides(createSlidesDto: CreateSlideDto): Promise<Slide> {
    if (!createSlidesDto.path) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    const newSlides = this.SlidesRepository.create(createSlidesDto);

    try {
      return await this.SlidesRepository.save(newSlides);
    } catch (error) {
      throw new BadRequestException('Ошибка при сохранении карточки');
    }
  }

  async getSlidesById(id: number): Promise<Slide> {
    const Slides = await this.SlidesRepository.findOne({ where: { id } });
    if (!Slides) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }
    return Slides;
  }

  async updateSlides(id: number, updateSlidesDto: UpdateSlideDto): Promise<Slide> {
    const Slides = await this.SlidesRepository.findOne({ where: { id } });
    if (!Slides) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    this.SlidesRepository.merge(Slides, updateSlidesDto);
    return this.SlidesRepository.save(Slides);
  }

  async deleteSlides(id: number): Promise<void> {
    const Slides = await this.SlidesRepository.findOne({ where: { id } });
    if (!Slides) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    await this.SlidesRepository.remove(Slides);
  }
}
