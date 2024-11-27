import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Exhibit } from '../exhibits/exhibits.entity';
import { User } from '../users/user.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique identifier of the comment' })
    id: number;
  
    @Expose()
    @Column({ type: 'text' })
    @ApiProperty({ example: 'This exhibit is amazing!', description: 'The text of the comment' })
    text: string;
  
    @Expose()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ example: '2024-11-24T12:34:56.789Z', description: 'Date and time when the comment was created' })
    createdAt: Date;
  
    @Expose()
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE', eager: true })
    @ApiProperty({ description: 'User who created the comment', type: () => User })
    user: User;
  
    @ManyToOne(() => Exhibit, (exhibit) => exhibit.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibitId' })
    @ApiProperty({ description: 'Exhibit to which the comment belongs', type: () => Exhibit })
    exhibit: Exhibit;
    
    @Column()
    exhibitId: number;
}