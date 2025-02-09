import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

const MinLoginLength = 4;
const MinPasswordLength = 4;

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get an user by ID or username' })
    @ApiQuery({ name: 'id', required: false, description: 'ID of the user' })
    @ApiQuery({ name: 'username', required: false, description: 'Username of the user' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUser(
        @Query('id') id?: number,
        @Query('username') username?: string,
    ){
        if (!id && !username) {
            throw new NotFoundException('Either ID or username must be provided');
        }

        const user = id ?
            await this.usersService.findById(id) :
            await this.usersService.findByUsername(username);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }

    @ApiOperation({ summary: 'Registration of a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Invalid data provided' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      if (
        (!createUserDto.username || !createUserDto.password) ||
        (createUserDto.username.length < MinLoginLength) || (createUserDto.password.length < MinPasswordLength)
      ) {
        throw new BadRequestException(`The username and password must be at least ${MinLoginLength} characters long`);
      }
  
      const user = this.usersService.create(createUserDto.username, createUserDto.password);

      return plainToInstance(User, user, { excludeExtraneousValues: true });
    }
}
