import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly TeamRepository: Repository<Team>,
  ) {}

  // ========================
  // GET запити
  // ========================

 
  async getAllTeams(): Promise<Team[]> {
    return this.TeamRepository.find();
  }

  async getUkTeams(): Promise<Team[]> {
    return this.TeamRepository.find({
      select: {
        id: true,
        name: true,
        status: true,
        path: true
      }
    });
  }

  async getEnTeams(): Promise<Team[]> {
    return this.TeamRepository.find({
      select: {
        id: true,
        name_en: true,
        status_en: true,
        path: true
      }
    });
  }

  async getTeamById(id: number): Promise<Team> {
    const Team = await this.TeamRepository.findOneBy({ id });
    if (!Team) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }
    return Team;
  }

  // ========================
  // POST запити
  // ========================

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = this.TeamRepository.create(createTeamDto);
    return this.TeamRepository.save(newTeam);
  }

  // ========================
  // PUT запити
  // ========================

  async updateTeam(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const Team = await this.TeamRepository.findOneBy({ id });
    if (!Team) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    Object.assign(Team, updateTeamDto);
    return this.TeamRepository.save(Team);
  }

  // ========================
  // DELETE запити
  // ========================

  async deleteTeam(id: number): Promise<void> {
    const Team = await this.TeamRepository.findOneBy({ id });
    if (!Team) {
      throw new NotFoundException(`Картка з ID ${id} не знайдена`);
    }

    await this.TeamRepository.remove(Team);
  }
}