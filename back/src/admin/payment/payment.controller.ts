import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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

@ApiTags('Оплати')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі оплати' })
  @ApiResponse({ status: 200, description: 'Список оплат успішно отримано' })
  async getAllPayments() {
    return this.paymentService.getAllPayment();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати оплату за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID оплати' })
  @ApiResponse({ status: 200, description: 'Оплату успішно отримано' })
  @ApiResponse({ status: 404, description: 'Оплату не знайдено' })
  async getPaymentById(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.getPaymentById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нову оплату' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для створення оплати', type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Оплату успішно створено' })
  @ApiResponse({ status: 400, description: 'Помилка при створенні оплати' })
  @UseInterceptors(AnyFilesInterceptor())
  async createPayment(@Body() body: any) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const createPaymentDto = new CreatePaymentDto();
    Object.assign(createPaymentDto, parsedBody);

    return this.paymentService.createPayment(createPaymentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити оплату за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID оплати' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Дані для оновлення оплати', type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: 'Оплату успішно оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка при оновленні оплати' })
  @ApiResponse({ status: 404, description: 'Оплату не знайдено' })
  @UseInterceptors(AnyFilesInterceptor())
  async updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const updatePaymentDto: UpdatePaymentDto = {
      ...parsedBody,
    };

    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити оплату за ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID оплати' })
  @ApiResponse({ status: 200, description: 'Оплату з успішно видалено' })
  @ApiResponse({ status: 404, description: 'Оплату не знайдено' })
  async deletePayment(@Param('id', ParseIntPipe) id: number) {
    await this.paymentService.deletePayment(id);
    return { message: `Оплату з ID ${id} успішно видалено` };
  }
}
