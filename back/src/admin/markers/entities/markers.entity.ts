import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Marker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lat: number; // Широта

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  lng: number; // Долгота

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string; // Заголовок

  @Column({ type: 'varchar', length: 255, nullable: true })
  title_en?: string; // Заголовок на английском

  @Column({ type: 'varchar', length: 20, nullable: true })
  link?: string; // Номер телефона

  @Column({ type: 'varchar', length: 255, nullable: true })
  path?: string; // Путь
}
