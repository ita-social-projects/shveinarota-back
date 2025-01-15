import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/markers.entity';
import { Card } from '../cards/entities/card.entity';
import { Link } from '../mediaLinks/entities/links.entity';
import { Partner } from '../partners/entities/partners.entity';
import { Slide } from '../slides/entities/slide.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Marker) private MarkerRepository: Repository<Marker>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    @InjectRepository(Partner) private PartnerRepository: Repository<Partner>,
    @InjectRepository(Slide) private SlideRepository: Repository<Slide>,
  ) {}  

  async getCounts(): Promise<{ Marker: number; card: number, links: number, Partners: number, Slide: number}> {
    const MarkerCount = await this.MarkerRepository.count();
    const cardCount = await this.cardRepository.count();
    const linkCount = await this.linkRepository.count();
    const PartnerCount = await this.PartnerRepository.count();
    const SlideCount = await this.SlideRepository.count();
    return { Marker: MarkerCount, card: cardCount, links: linkCount, Partners: PartnerCount, Slide: SlideCount };
  }
}
