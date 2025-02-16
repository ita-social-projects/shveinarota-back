import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ default: 'Admin' }) 
  username: string;

  @Column({ default: '12345' }) 
  password: string;
}
