import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username123', description: 'Username for registration' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  username: string;


  @ApiProperty({ example: 'password123', description: 'User password' })
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;
}