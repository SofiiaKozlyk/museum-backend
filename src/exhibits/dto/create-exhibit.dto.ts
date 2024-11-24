import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateExhibitDto {
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL of the exhibit image' })
    @IsNotEmpty()
    @IsString()
    //   @IsUrl({}, { message: 'Має бути валідний URL' })
    imageUrl: string;

    @ApiProperty({ example: 'This is a description of the exhibit.', description: 'Text description of the exhibit' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Description must be at least 4 characters long' })
    //   @MaxLength(500, { message: 'Опис не може бути довшим за 500 символів' })
    description: string;
}