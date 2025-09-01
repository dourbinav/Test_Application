// import { Test } from 'src/test/test.entity';
import { Test } from 'src/test/test.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  dateofJoining: Date;

  @Column({ nullable: true })
  TechStack: string;

  @Column({ default: false })
  iscertified: boolean;

  @ManyToOne(() => Test, { eager: true })
  @JoinColumn({ name: 'testId' }) // column in users table
  test: Test;
}
