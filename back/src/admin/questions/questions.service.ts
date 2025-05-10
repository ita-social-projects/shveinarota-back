import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async getAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getUkQuestions(): Promise<Question[]> {
    return this.questionRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
  }

  async getEnQuestions(): Promise<Question[]> {
    return this.questionRepository.find({
      select: {
        id: true,
        title_en: true,
        description_en: true,
      },
    });
  }

  async getQuestionById(id: number): Promise<Question> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Питання з ID ${id} не знайдено`);
    }
    return question;
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const newQuestion = this.questionRepository.create(createQuestionDto);
    return this.questionRepository.save(newQuestion);
  }

  async updateQuestion(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Питання з ID ${id} не знайдено`);
    }

    Object.assign(question, updateQuestionDto);
    return this.questionRepository.save(question);
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new NotFoundException(`Питання з ID ${id} не знайдено`);
    }

    await this.questionRepository.remove(question);
  }
}
