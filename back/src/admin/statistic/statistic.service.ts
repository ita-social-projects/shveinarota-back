import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/markers.entity';
import { Card } from '../cards/entities/card.entity';
import { MediaLink } from '../mediaLinks/entities/medialink.entity';
import { Partner } from '../partners/entities/partners.entity';
import { Slide } from '../slides/entities/slide.entity';
import { Category } from '../data_guides/entities/category.entity'
import { Subcategory } from '../data_guides/entities/subcategory.entity'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Marker) private MarkerRepository: Repository<Marker>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(MediaLink) private MediaLinkRepository: Repository<MediaLink>,
    @InjectRepository(Partner) private PartnerRepository: Repository<Partner>,
    @InjectRepository(Slide) private SlideRepository: Repository<Slide>,
    @InjectRepository(Category) private CategoryRepository: Repository<Category>,
    @InjectRepository(Subcategory) private SubcategoryRepository: Repository<Subcategory>, // Исправлено
  ) {}  

  async getCounts(): Promise<{ Marker: number; card: number; MediaLinks: number; Partners: number; Slide: number; Category: number; Subcategory: number }> {
    const MarkerCount = await this.MarkerRepository.count();
    const cardCount = await this.cardRepository.count();
    const MediaLinkCount = await this.MediaLinkRepository.count();
    const PartnerCount = await this.PartnerRepository.count();
    const SlideCount = await this.SlideRepository.count();
    const CategoryCount = await this.CategoryRepository.count();
    const SubcategoryCount = await this.SubcategoryRepository.count();

    return { 
      Marker: MarkerCount, 
      card: cardCount, 
      MediaLinks: MediaLinkCount, 
      Partners: PartnerCount, 
      Slide: SlideCount, 
      Category: CategoryCount, 
      Subcategory: SubcategoryCount 
    };
  }
}


