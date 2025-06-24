import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { MarkersModule } from './markers/markers.module';
import { PartnersModule } from './partners/partners.module';
import { SlidesModule } from './slides/slides.module';
import { LinksModule } from './mediaLinks/medialink.module';
import { StatisticsModule } from './statistic/statistic.module';
import { CategoryModule } from './data_guides/category.module';
import { LogoModule } from './logo/logo.module';
import { SharedModule } from '../common/guard/jwt.module';
import { PlotsModule } from './plot_slides/plots.module';
import { TeamModule } from './team_members/team.module';
import { PaymentsModule } from './payment/payment.module';
import { QuestionModule } from './questions/questions.module';
import { WorkShopCardsModule } from './workShopCards/workShopCards.module';
import { NewsModule } from './data_news/news.module';

@Module({
  imports: [
    CardsModule,
    MarkersModule,
    PartnersModule,
    SlidesModule,
    LinksModule,
    StatisticsModule,
    CategoryModule,
    LogoModule,
    SharedModule,
    PlotsModule,
    TeamModule,
    PaymentsModule,
    QuestionModule,
    WorkShopCardsModule,
    NewsModule,
  ],
})
export class AdminModule {}
