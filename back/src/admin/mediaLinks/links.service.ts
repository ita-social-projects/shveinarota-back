import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/links.entity';
import { CreateLinkDto } from './dto/create-links.dto';
import { UpdateLinkDto } from './dto/update-links.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly LinksRepository: Repository<Link>,
  ) {}

  async getAllLinks(): Promise<Link[]> {
    return this.LinksRepository.find({ cache: true });
  }

  async createLinks(createLinksDto: CreateLinkDto): Promise<Link> {
    if (!createLinksDto.path) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    const newLinks = this.LinksRepository.create(createLinksDto);

    try {
      return await this.LinksRepository.save(newLinks);
    } catch (error) {
      throw new BadRequestException('Ошибка при сохранении карточки');
    }
  }

  async getLinksById(id: number): Promise<Link> {
    const Links = await this.LinksRepository.findOne({ where: { id } });
    if (!Links) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }
    return Links;
  }

  async updateLinks(id: number, updateLinksDto: UpdateLinkDto): Promise<Link> {
    const Links = await this.LinksRepository.findOne({ where: { id } });
    if (!Links) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    this.LinksRepository.merge(Links, updateLinksDto);
    return this.LinksRepository.save(Links);
  }

  async deleteLinks(id: number): Promise<void> {
    const Links = await this.LinksRepository.findOne({ where: { id } });
    if (!Links) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    await this.LinksRepository.remove(Links);
  }
}
