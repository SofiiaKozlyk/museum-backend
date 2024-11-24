import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly appService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Получение списка пользователей' })
    @ApiQuery({ name: 'id', required: false, description: 'ID пользователя' })
    @ApiQuery({ name: 'username', required: false, description: 'Имя пользователя' })
    @ApiResponse({ status: 200, description: 'Успешное получение списка пользователей' })
    @ApiResponse({ status: 404, description: 'Пользователи не найдены' })
    async getAllUsers(
        @Query('id') id?: number,
        @Query('username') username?: string,
    ){

    }
}
