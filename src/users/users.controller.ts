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
    @ApiOperation({ summary: 'Получение списка пользователей' })
    @ApiQuery({ name: 'id', required: false, description: 'ID пользователя' })
    @ApiQuery({ name: 'username', required: false, description: 'Имя пользователя' })
    @ApiResponse({ status: 200, description: 'Успешное получение списка пользователей' })
    @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
    async getUser(
        @Query('id') id?: number,
        @Query('username') username?: string,
    ){
        if (!id && !username) {
            throw new NotFoundException('ID или username должны быть указаны');
        }

        const user = id ?
            await this.usersService.findById(id) :
            await this.usersService.findByUsername(username);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return plainToInstance(User, user, { excludeExtraneousValues: true });
    }

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      if (
        (!createUserDto.username || !createUserDto.password) ||
        (createUserDto.username.length < MinLoginLength) || (createUserDto.password.length < MinPasswordLength)
      ) {
        throw new BadRequestException(`Длинна пароля и логина должна быть не меньше ${MinLoginLength} символов`);
      }
  
      const user = this.usersService.create(createUserDto.username, createUserDto.password);

      return plainToInstance(User, user, { excludeExtraneousValues: true });
    }


}
