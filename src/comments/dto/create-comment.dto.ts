import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This exhibit is amazing!', description: 'The text of the comment' })
  @IsNotEmpty()
  @IsString()
  text: string;
}