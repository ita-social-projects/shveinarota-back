import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

export type Lang = 'uk' | 'en';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const newsEntity = this.newsRepository.create({
      ...createNewsDto,
      createdAt: new Date(createNewsDto.createdAt),
    });
    return this.newsRepository.save(newsEntity);
  }

  async findAllPaginated(
    page: number,
    limit: number,
    lang: Lang,
  ): Promise<{
    data: {
      id: number;
      tags: string[];
      title: string;
      createdAt: Date;
      content: any[];
    }[];
    total: number;
    page: number;
    limit: number;
  }> {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;
    const [items, total] = await this.newsRepository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const data = items.map(item => {
      const tags = lang === 'en' && item.tagsEn?.length ? item.tagsEn : item.tagsUk;
      const title = lang === 'en' && item.titleEn ? item.titleEn : item.titleUk;
      const content =
        lang === 'en' && item.contentEn?.length ? item.contentEn : item.contentUk;
      return { id: item.id, tags, title, createdAt: item.createdAt, content };
    });

    return { data, total, page, limit: take };
  }

  async findOne(id: number, lang: Lang): Promise<{
    id: number;
    tags: string[];
    title: string;
    createdAt: Date;
    content: any[];
  }> {
    const item = await this.newsRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Новину з id ${id} не знайдено`);

    const tags = lang === 'en' && item.tagsEn?.length ? item.tagsEn : item.tagsUk;
    const title = lang === 'en' && item.titleEn ? item.titleEn : item.titleUk;
    const content =
      lang === 'en' && item.contentEn?.length ? item.contentEn : item.contentUk;

    return { id: item.id, tags, title, createdAt: item.createdAt, content };
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const existing = await this.newsRepository.findOneBy({ id });
    if (!existing) throw new NotFoundException(`Новину з id ${id} не знайдено`);

    const merged = this.newsRepository.merge(existing, {
      ...updateNewsDto,
      createdAt: updateNewsDto.createdAt
        ? new Date(updateNewsDto.createdAt)
        : existing.createdAt,
    });
    return this.newsRepository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Новину з id ${id} не знайдено`);
  }
}
