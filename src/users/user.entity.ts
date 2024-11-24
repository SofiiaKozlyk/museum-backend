import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор пользователя' })
  id: number;

  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'username123', description: 'Уникальное имя пользователя' })
  username: string;

  @Column()
  @ApiProperty({ example: 'hashedPassword', description: 'Хешированный пароль пользователя' })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}