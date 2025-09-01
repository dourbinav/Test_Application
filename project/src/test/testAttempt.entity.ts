import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Test } from './test.entity';

export enum TestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

@Entity('test_attempt')
export class TestAttempt {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Test, (test) => test.id, { onDelete: 'CASCADE' })
  test: Test;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: TestStatus,
    default: TestStatus.PENDING,
  })
  status: TestStatus;

  @Column({ nullable: true })
  marks: number;
}
