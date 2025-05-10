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
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guard/JwtAuthGuard';

@ApiTags('Питання')
@Controller(':lang/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі питання для вказаної мови' })
  @ApiParam({
    name: 'lang',
    required: true,
    description: 'Мова питань (en або uk)',
  })
  @ApiResponse({ status: 200, description: 'Список питань успішно отримано' })
  @ApiResponse({ status: 400, description: 'Неправильний формат мови' })
  async getQuestions(@Param('lang') lang: string) {
    return lang === 'en'
      ? this.questionsService.getEnQuestions()
      : this.questionsService.getUkQuestions();
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі питання незалежно від мови' })
  @ApiResponse({ status: 200, description: 'Список всіх питань отримано' })
  async getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати питання за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID питання' })
  @ApiResponse({ status: 200, description: 'Питання успішно отримано' })
  @ApiResponse({ status: 404, description: 'Питання не знайдено' })
  async getQuestionById(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getQuestionById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити нове питання' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для створення питання',
    type: CreateQuestionDto,
  })
  @ApiResponse({ status: 201, description: 'Питання успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні питання' })
  @UseInterceptors(AnyFilesInterceptor())
  async createQuestion(@Body() body: any) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const createDto = new CreateQuestionDto();
    Object.assign(createDto, parsedBody);

    return this.questionsService.createQuestion(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити питання за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID питання' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Дані для оновлення питання',
    type: UpdateQuestionDto,
  })
  @ApiResponse({ status: 200, description: 'Питання успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні питання' })
  @ApiResponse({ status: 404, description: 'Питання не знайдено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const updateDto: UpdateQuestionDto = {
      ...parsedBody,
    };

    return this.questionsService.updateQuestion(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити питання за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID питання' })
  @ApiResponse({ status: 200, description: 'Питання успішно видалено' })
  @ApiResponse({ status: 404, description: 'Питання не знайдено' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    await this.questionsService.deleteQuestion(id);
    return { message: 'Питання успішно видалено' };
  }
}
