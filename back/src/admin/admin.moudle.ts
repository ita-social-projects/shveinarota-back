import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { MarkersModule } from './markers/markers.module';
import { PartnersModule } from './partners/partners.module';
import { SlidesModule } from './slides/slides.module'

@Module({
  imports: [
    CardsModule, // Подключаем модуль для работы с карточками
    MarkersModule, // Подключаем модуль для работы с картой
    PartnersModule, // Подключаем модуль для работы с партёрами
    SlidesModule,

  ],
})
export class AdminModule {}
