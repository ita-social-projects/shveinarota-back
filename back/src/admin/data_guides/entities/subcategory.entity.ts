import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Detail } from './detail.entity';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  categoryname: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToOne(() => Detail, (detail) => detail.subcategory, {
    cascade: true,
  })
  @JoinColumn()
  detail: Detail;
}
