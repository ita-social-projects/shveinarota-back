import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from './entities/markers.entity';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private readonly MarkerRepository: Repository<Marker>,
  ) {}

  async getAllMarkers(): Promise<Marker[]> {
    return this.MarkerRepository.find({ cache: false });
  }

  async createMarker(createMarkerDto: CreateMarkerDto): Promise<Marker> {
    const newMarker = this.MarkerRepository.create(createMarkerDto);
    return this.MarkerRepository.save(newMarker);
  }

  async getMarkerById(id: number): Promise<Marker> {
    const Marker = await this.MarkerRepository.findOneBy({ id });
    if (!Marker) {
      throw new NotFoundException(`Marker with ID ${id} not found`);
    }
    return Marker;
  }

  async updateMarker(id: number, updateMarkerDto: UpdateMarkerDto): Promise<Marker> {
    const Marker = await this.MarkerRepository.findOneBy({ id });
    if (!Marker) {
      throw new NotFoundException(`Marker with ID ${id} not found`);
    }

    // Удаляем старый файл изображения, если загружено новое
    if (updateMarkerDto.path && Marker.path !== updateMarkerDto.path) {
      const oldFilePath = path.resolve(Marker.path);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${oldFilePath}`, err);
      }
    }

    // Обновляем данные карточки
    Object.assign(Marker, updateMarkerDto);
    return this.MarkerRepository.save(Marker);
  }

  async deleteMarker(id: number): Promise<void> {
    const Marker = await this.MarkerRepository.findOneBy({ id });
    if (!Marker) {
      throw new NotFoundException(`Marker with ID ${id} not found`);
    }

    // Удаляем файл изображения с диска
    if (Marker.path) {
      const filePath = path.resolve(Marker.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
      }
    }

    // Удаляем запись о карточке из базы данных
    await this.MarkerRepository.remove(Marker);
  }
}
