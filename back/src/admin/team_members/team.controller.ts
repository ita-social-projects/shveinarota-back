import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard'; 

@ApiTags('Команда')
@Controller(':lang/teams')
export class TeamsController {
  constructor(private readonly TeamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі члени для вказаної мови' })
  @ApiParam({ name: 'lang', required: true, description: 'Мова карток (en або uk)' })
  @ApiResponse({ status: 200, description: 'Список карток успішно отримано' })
  @ApiResponse({ status: 400, description: 'Неправильний формат мови' })
  async getTeams(@Param('lang') lang: string) {
    return lang === 'en' ? this.TeamsService.getEnTeams() : this.TeamsService.getUkTeams();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі члени незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Список всіх карток отримано' })
  async getAllTeams() {
    return this.TeamsService.getAllTeams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати члена за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID члени' })
  @ApiResponse({ status: 200, description: 'Картка успішно отримана' })
  @ApiResponse({ status: 404, description: 'Члена команди не знайдено' })
  async getTeamById(@Param('id', ParseIntPipe) id: number) {
    return this.TeamsService.getTeamById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Створити нову члена' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для створення члени', type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'члена успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні члени' })
  @UseInterceptors(AnyFilesInterceptor())
  async createTeam(@Body() body: any) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const createTeamDto = new CreateTeamDto();
    Object.assign(createTeamDto, parsedBody);
  
    return this.TeamsService.createTeam(createTeamDto);
  }
  

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити члена за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID члени' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для оновлення члени', type: UpdateTeamDto })
  @ApiResponse({ status: 200, description: 'члена успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні члени' })
  @ApiResponse({ status: 404, description: 'члена не знайдено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const updateTeamDto: UpdateTeamDto = {
      ...parsedBody
    };

    return this.TeamsService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Видалити члена за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID члени' })
  @ApiResponse({ status: 200, description: 'члена успішно видалено' })
  @ApiResponse({ status: 404, description: 'члена не знайдено' })
  async deleteTeam(@Param('id', ParseIntPipe) id: number) {
    await this.TeamsService.deleteTeam(id);
    return { message: 'члена успішно видалено' };
  }
}
