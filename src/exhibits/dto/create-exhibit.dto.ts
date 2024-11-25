import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateExhibitDto {
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the exhibit image' })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({ example: 'This is a description of the exhibit.', description: 'Text description of the exhibit' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Description must be at least 4 characters long' })
    description: string;
}