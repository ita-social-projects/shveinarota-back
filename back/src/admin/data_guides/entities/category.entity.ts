import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Subcategory } from "./subcategory.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  category: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  category_en: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
