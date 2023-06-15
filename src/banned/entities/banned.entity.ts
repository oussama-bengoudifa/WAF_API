import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Banned {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @Column()
  date: string;

  @Column({ nullable: true, default: null })
  userAgent: string;

  @Column()
  requestId: string;

  @Column()
  file: string;
}
