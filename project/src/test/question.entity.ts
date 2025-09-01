import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Test } from '../test/test.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Test, (test) => test.questions, { onDelete: 'CASCADE' })
  test: Test;

  @Column()
  text: string;

  @Column('simple-array') // stores ["a","b","c","d"]
  options: string[];

  @Column()
  correctAnswer: string; // Admin marks correct answer
}
