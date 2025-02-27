import { Module } from '@nestjs/common';
import { PlotController } from './plots.controller';
import { PlotService } from './plots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plot } from './entities/plot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plot])], 
  controllers: [PlotController],
  providers: [PlotService],
  exports: [PlotService], 
})
export class PlotsModule {}