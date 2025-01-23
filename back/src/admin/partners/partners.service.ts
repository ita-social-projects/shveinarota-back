import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partners.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly PartnersRepository: Repository<Partner>,
  ) {}

  async getAllPartners(): Promise<Partner[]> {
    return this.PartnersRepository.find({ cache: true });
  }

  async createPartners(createPartnersDto: CreatePartnerDto): Promise<Partner> {
    if (!createPartnersDto.path) {
      throw new BadRequestException('Ссылка на изображение обязательна');
    }

    const newPartners = this.PartnersRepository.create(createPartnersDto);

    try {
      return await this.PartnersRepository.save(newPartners);
    } catch (error) {
      throw new BadRequestException('Ошибка при сохранении карточки');
    }
  }

  async getPartnersById(id: number): Promise<Partner> {
    const Partners = await this.PartnersRepository.findOne({ where: { id } });
    if (!Partners) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }
    return Partners;
  }

  async updatePartners(id: number, updatePartnersDto: UpdatePartnerDto): Promise<Partner> {
    const Partners = await this.PartnersRepository.findOne({ where: { id } });
    if (!Partners) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    this.PartnersRepository.merge(Partners, updatePartnersDto);
    return this.PartnersRepository.save(Partners);
  }

  async deletePartners(id: number): Promise<void> {
    const Partners = await this.PartnersRepository.findOne({ where: { id } });
    if (!Partners) {
      throw new NotFoundException(`Карточка с ID ${id} не найдена`);
    }

    await this.PartnersRepository.remove(Partners);
  }
}
