import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ReorderTeamsDto } from './dto/reorder-teams.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly TeamRepository: Repository<Team>,
  ) {}

  async getAllTeams(): Promise<Team[]> {
    return this.TeamRepository.find();
  }

  async getUkTeams(): Promise<Team[]> {
    return this.TeamRepository.find({
      select: { id: true, name: true, status: true, path: true },
    });
  }

  async getEnTeams(): Promise<Team[]> {
    return this.TeamRepository.find({
      select: { id: true, name_en: true, status_en: true, path: true },
    });
  }

  async getTeamById(id: number): Promise<Team> {
    const team = await this.TeamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    return team;
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = this.TeamRepository.create(createTeamDto);
    return this.TeamRepository.save(newTeam);
  }

  async updateTeam(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.TeamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    Object.assign(team, updateTeamDto);
    return this.TeamRepository.save(team);
  }

  async deleteTeam(id: number): Promise<void> {
    const team = await this.TeamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    await this.TeamRepository.remove(team);
  }

  async reorder(ids: number[]): Promise<{ id: number; position: number }[]> {
    const teams = await this.TeamRepository.findByIds(ids);
    if (teams.length !== ids.length) {
      throw new BadRequestException('Некоторые ID не найдены');
    }
    const updatePromises = ids.map((id, index) =>
      this.TeamRepository.update(id, { position: index + 1 }),
    );
    await Promise.all(updatePromises);
    const updated = await this.TeamRepository.findByIds(ids);
    return updated
      .map(({ id, position }) => ({ id, position }))
      .sort((a, b) => a.position - b.position);
  }
}
