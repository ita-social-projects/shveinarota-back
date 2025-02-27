import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plot } from './entities/plot.entity';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PlotService {
  constructor(
    @InjectRepository(Plot)
    private readonly PlotRepository: Repository<Plot>,
  ) {}

  // Метод для получения всех слайдов
  async getAllPlots(): Promise<Plot[]> {
    try {
      return await this.PlotRepository.find({ cache: false });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Plots');
    }
  }

  async getUkPlots(): Promise<Plot[]> {
      try {
        return this.PlotRepository.find({
          select: {
            id: true,
            path: true,
            title: true,
            url: true
          }
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch Ukrainian Plots');
      }
    }
  
    // Получение ссылок для английского языка
    async getEnPlots(): Promise<Plot[]> {
      try {
        return this.PlotRepository.find({
          select: {
            id: true,
            path: true,
            title_en: true,
            url: true
          }
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch English Plots');
      }
    }

  // Метод для создания нового слайда
  async createPlot(createPlotDto: CreatePlotDto): Promise<Plot> {
    const newPlot = this.PlotRepository.create(createPlotDto);
    try {
      return await this.PlotRepository.save(newPlot);
    } catch (error) {
      
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Plot with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to create Plot');
    }
  }

  // Метод для получения слайда по ID с полной информацией
  async getPlotById(id: number): Promise<Plot> {
    try {
      const Plot = await this.PlotRepository.findOne({
        where: { id },
      });

      if (!Plot) {
        throw new NotFoundException(`Plot with ID ${id} not found`);
      }

      // Возвращаем слайд с полными данными, включая оба языка
      return {
        id: Plot.id,
        path: Plot.path,
        title: Plot.title, // Украинский или основной
        title_en: Plot.title_en, // Английский
        url: Plot.url, // Украинский или основной
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Plot');
    }
  }

  // Метод для обновления слайда по ID
  async updatePlot(id: number, updatePlotDto: UpdatePlotDto): Promise<Plot> {
    try {
      const Plot = await this.PlotRepository.findOne({ where: { id } });
      if (!Plot) {
        throw new NotFoundException(`Plot with ID ${id} not found`);
      }


      // Обновляем данные слайда
      Object.assign(Plot, updatePlotDto);
      return await this.PlotRepository.save(Plot);
    } catch (error) {
      
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('Plot with this URL already exists');
      }
      throw new InternalServerErrorException('Failed to update Plot');
    }
  }

  // Метод для удаления слайда по ID
  async deletePlot(id: number): Promise<void> {
    try {
      const Plot = await this.PlotRepository.findOne({ where: { id } });
      if (!Plot) {
        throw new NotFoundException(`Plot with ID ${id} not found`);
      }

      
      await this.PlotRepository.remove(Plot);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete Plot');
    }
  }


}
