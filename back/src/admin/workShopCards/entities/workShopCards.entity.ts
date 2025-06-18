import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class workShopCards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title_en?: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  description_en?: string;

  @Column({ type: 'varchar', length: 255 })
  schedule: string[];

  @Column('json')
  link: string[];
}
