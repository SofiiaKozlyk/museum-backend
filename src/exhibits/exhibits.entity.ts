import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Exhibit {
    @Expose()
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'Unique identifier of the exhibit' })
    id: number;

    @Expose()
    @Column()
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the exhibit image' })
    imageUrl: string;

    @Expose()
    @Column()
    @ApiProperty({ example: 'This is a description of the exhibit.', description: 'Text description of the exhibit' })
    description: string;

    @Expose()
    @ManyToOne(() => User, (user) => user.exhibits, { eager: true })
    @JoinColumn({ name: 'userId' })
    @ApiProperty({
        example: { id: 1, username: 'user123' },
        description: 'User who created the exhibit',
        type: () => User
    })
    user: User;

    @Column()
    userId: number;

    @Expose()
    @ApiProperty({
        example: '2024-11-24T12:34:56.789Z',
        description: 'Date and time when the exhibit was created (ISO 8601 format)'
    })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}