import { BadRequestException, Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExhibitsService } from './exhibits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import { plainToInstance } from 'class-transformer';
import { Exhibit } from './exhibits.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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








}
