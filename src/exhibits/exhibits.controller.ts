import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExhibitsService } from './exhibits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import { plainToInstance } from 'class-transformer';
import { Exhibit } from './exhibits.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedExhibits } from 'src/types/PaginatedExhibits';

@ApiTags('exhibits')
@Controller('api/exhibits')
export class ExhibitsController {
    constructor(private readonly exhibitsService: ExhibitsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Creating a new exhibit' })
    @ApiResponse({ status: 201, description: 'The exhibit has been successfully created' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary', description: 'The image file for the exhibit' },
                description: { type: 'string', description: 'Description of the exhibit' },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createExhibitDto: CreateExhibitDto,
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }

        const validMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('File must be an image (jpg, jpeg, png, gif)');
        }

        if (!createExhibitDto.description || createExhibitDto.description.trim().length === 0) {
            throw new BadRequestException('Description is required');
        }

        const exhibit = this.exhibitsService.create(file, createExhibitDto.description, req.user.id);

        return plainToInstance(Exhibit, exhibit, { excludeExtraneousValues: true });
    }


    @Get()
    @ApiOperation({ summary: 'Get all exhibits with pagination' })
    @ApiResponse({ status: 200, description: 'List of all exhibits' })
    @ApiResponse({ status: 400, description: 'Bad request, e.g., invalid pagination parameters' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
    async getExhibits(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const exhibits = await this.exhibitsService.getExhibits(page, limit);
        return {
            ...exhibits,
            data: plainToInstance(Exhibit, exhibits.data, { excludeExtraneousValues: true })
        };
    }

    @Get('post/:id')
    @ApiOperation({ summary: 'Get an exhibit by ID' })
    @ApiParam({ name: 'id', description: 'ID of the exhibit', example: 1 })
    @ApiResponse({ status: 200, description: 'Exhibit found' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async getExhibitById(@Param('id', ParseIntPipe) id: number): Promise<Exhibit> {
        const exhibit = this.exhibitsService.getExhibitById(id);
        
        if (!exhibit) {
            throw new NotFoundException(`Exhibit with id ${id} not found`);
          }

        return plainToInstance(Exhibit, exhibit, { excludeExtraneousValues: true });
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete an exhibit by ID' })
    @ApiParam({ name: 'id', description: 'ID of the exhibit', example: 1 })
    @ApiResponse({ status: 200, description: 'Exhibit successfully deleted' })
    @ApiResponse({ status: 403, description: 'You are not the author of this exhibit' })
    @ApiResponse({ status: 404, description: 'Exhibit not found' })
    async deleteExhibitById(
      @Param('id', ParseIntPipe) id: number,
      @Req() req,
    ): Promise<{ message: string }> {
      const userId = req.user.id; 
      return await this.exhibitsService.deleteExhibitById(id, userId);
    }
}
