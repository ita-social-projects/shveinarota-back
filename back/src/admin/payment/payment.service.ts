import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getAllPayment(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Оплата з ID ${id} не знайдена`);
    }
    return payment;
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(newPayment);
  }

  async updatePayment(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`Оплата з ID ${id} не знайдена`);
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async deletePayment(id: number): Promise<void> {
    const payment = await this.paymentRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException(`оплата з ID ${id} не знайдена`);
    }

    await this.paymentRepository.remove(payment);
  }
}
