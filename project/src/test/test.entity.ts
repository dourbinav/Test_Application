import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //   ManyToOne,
  OneToMany,
} from 'typeorm';
// import { User } from '../user/user.entity';
import { Question } from './question.entity';
import { User } from 'src/user/user.entity';

export enum TestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.test)
  users: User[];

  @Column({ nullable: true })
  testName: string;

  @OneToMany(() => Question, (q) => q.test, { cascade: true })
  questions: Question[];

  @Column({ nullable: true })
  expiresAt: Date;
}
