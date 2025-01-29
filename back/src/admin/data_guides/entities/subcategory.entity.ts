import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  subcategory: string;

  @Column({ type: 'varchar', length: 600, nullable: false })
  url: string;

  @Column('json')
  lekala: { path: string; text: string }[];

  @Column('json')
  authors: string[];

  @Column('json')
  example: string[];

  @Column({ type: 'varchar', length: 600, nullable: false })
  details: string;

  @Column({ type: 'varchar', length: 600, nullable: false })
  summary: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  categoryname: string; // Дублирующее название категории (для удобства)

  @ManyToOne(() => Category, (category) => category.subcategories, { nullable: false })
  category: Category; // Связь с категорией
}
