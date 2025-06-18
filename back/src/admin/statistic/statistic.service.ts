import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/markers.entity';
import { Card } from '../cards/entities/card.entity';
import { MediaLink } from '../mediaLinks/entities/medialink.entity';
import { Partner } from '../partners/entities/partners.entity';
import { Slide } from '../slides/entities/slide.entity';
import { Category } from '../data_guides/entities/category.entity';
import { Subcategory } from '../data_guides/entities/subcategory.entity';
import { Plot } from '../plot_slides/entities/plot.entity';
import { Team } from '../team_members/entities/team.entity';
import { workShopCards } from '../workShopCards/entities/workShopCards.entity';

@Injectable()
export class StatisticsService {
  [x: string]: any;
  constructor(
    @InjectRepository(Marker) private MarkerRepository: Repository<Marker>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(MediaLink)
    private MediaLinkRepository: Repository<MediaLink>,
    @InjectRepository(Partner) private PartnerRepository: Repository<Partner>,
    @InjectRepository(Slide) private SlideRepository: Repository<Slide>,
    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private SubcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Plot) private PlotRepository: Repository<Plot>,
    @InjectRepository(Team) private TeamRepository: Repository<Team>,
    @InjectRepository(workShopCards)
    private workShopCardsRepository: Repository<workShopCards>,
  ) {}

  async getCounts(): Promise<{
    Marker: number;
    card: number;
    MediaLinks: number;
    Partners: number;
    Slide: number;
    Category: number;
    Subcategory: number;
    Plot: number;
    Team: number;
    workShopCards: number;
  }> {
    const MarkerCount = await this.MarkerRepository.count();
    const cardCount = await this.cardRepository.count();
    const MediaLinkCount = await this.MediaLinkRepository.count();
    const PartnerCount = await this.PartnerRepository.count();
    const SlideCount = await this.SlideRepository.count();
    const CategoryCount = await this.CategoryRepository.count();
    const SubcategoryCount = await this.SubcategoryRepository.count();
    const PlotCount = await this.PlotRepository.count();
    const TeamCount = await this.TeamRepository.count();
    const workShopCardsCount = await this.workShopCardsRepository.count();

    return {
      Marker: MarkerCount,
      card: cardCount,
      MediaLinks: MediaLinkCount,
      Partners: PartnerCount,
      Slide: SlideCount,
      Category: CategoryCount,
      Subcategory: SubcategoryCount,
      Plot: PlotCount,
      Team: TeamCount,
      workShopCards: workShopCardsCount,
    };
  }
}
