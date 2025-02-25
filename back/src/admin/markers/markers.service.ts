import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from './entities/markers.entity';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private readonly MarkerRepository: Repository<Marker>,
  ) {}

  async getAllMarkers(): Promise<Marker[]> {
    return this.MarkerRepository.find({ cache: true });
  }

  async createMarker(createMarkerDto: CreateMarkerDto): Promise<Marker> {
    const newMarker = this.MarkerRepository.create(createMarkerDto);

    try {
        return await this.MarkerRepository.save(newMarker);
    } catch (error) {
        console.error('Помилка під час збереження маркера:', error.message);
        console.error('Деталі помилки:', error);
        throw new BadRequestException(`Помилка під час збереження маркера: ${error.message}`);
    }
  }

  async getUkMarkers(): Promise<Marker[]> {
    return this.MarkerRepository.find({
      select: {
        id: true,
        title: true,
        lat: true,
        lng: true,
        link: true,
        path: true
      }
    });
  }

  async getEnMarkers(): Promise<Marker[]> {
    return this.MarkerRepository.find({
      select: {
        id: true,
        title_en: true,
        lat: true,
        lng: true,
        link: true,
        path: true
      }
    });
  }
  
  async getMarkerById(id: number): Promise<Marker> {
    const marker = await this.MarkerRepository.findOne({ where: { id } });
    if (!marker) {
      throw new NotFoundException(`Маркера з ID ${id} не знайдено`);
    }
    return marker;
  }

  async updateMarker(id: number, updateMarkerDto: UpdateMarkerDto): Promise<Marker> {
    const marker = await this.MarkerRepository.findOne({ where: { id } });

    this.MarkerRepository.merge(marker, updateMarkerDto);
    return this.MarkerRepository.save(marker);
  }

  async deleteMarker(id: number): Promise<void> {
    const marker = await this.MarkerRepository.findOne({ where: { id } });
    if (!marker) {
      throw new NotFoundException(`Маркера з ID ${id} не знайдено`);
    }

    await this.MarkerRepository.remove(marker);
  }
}
