import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { MarkersModule } from './markers/markers.module';
import { PartnersModule } from './partners/partners.module';
import { SlidesModule } from './slides/slides.module'
import { LinksModule} from './mediaLinks/links.module'
import { StatisticsModule } from './statistic/statistic.module'
import { CategoryModule } from './data_guides/category.module'

@Module({
  imports: [
    CardsModule, // Подключаем модуль для работы с карточками
    MarkersModule, // Подключаем модуль для работы с картой
    PartnersModule, // Подключаем модуль для работы с партёрами
    SlidesModule, // Подключаем модуль для работы с cлайдером
    LinksModule, // Подключаем модуль для работы с сылками на соц сети
    StatisticsModule, // Подключаем модуль для работы с статистикой
    CategoryModule

  ],
})
export class AdminModule {}
