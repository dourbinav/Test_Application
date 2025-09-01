import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string; // so updateUserRefreshToken works
}
