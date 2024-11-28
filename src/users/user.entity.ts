import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Exhibit } from '../exhibits/exhibits.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @Expose()
  @Column({ unique: true })
  @ApiProperty({ example: 'username123', description: 'Unique username of the user' })
  username: string;

  @Column()
  @ApiProperty({ example: 'hashedPassword', description: 'Hashed password of the user' })
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Exhibit, (exhibit) => exhibit.user, { cascade: true })
  @ApiProperty({ type: () => [Exhibit], description: 'List of exhibits created by the user' })
  exhibits: Exhibit[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}