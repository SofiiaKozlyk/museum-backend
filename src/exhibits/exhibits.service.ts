import { BadRequestException, Injectable } from '@nestjs/common';
import { Exhibit } from './exhibits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import * as path from 'path';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as multer from 'multer';
import { promises as fsPromises } from 'fs';
import { PaginatedExhibits } from 'src/types/PaginatedExhibits';

@Injectable()
export class ExhibitsService {
    constructor(
        @InjectRepository(Exhibit)
        private exhibitsRepository: Repository<Exhibit>,
    ) { }

    async create(file: Express.Multer.File, description: string, userId: number): Promise<Exhibit> {
        const uploadsDir = path.join(__dirname, '../..', 'uploads');

        console.log(uploadsDir);

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
    
        const uniqueFileName = `${v4()}${path.extname(file.originalname)}`;
        const filePath = path.join(uploadsDir, uniqueFileName);

        console.log(filePath);
    
        try {
          fs.writeFileSync(filePath, file.buffer);
        } catch (error) {
          throw new BadRequestException('Error saving file');
        }

        const exhibit = this.exhibitsRepository.create({ 
            imageUrl: `/static/${uniqueFileName}`,
            description,
            userId
        });
    
        return await this.exhibitsRepository.save(exhibit);
      }
      
      async getExhibits(page: number, limit: number): Promise<PaginatedExhibits> {
        try {
          const skip = (page - 1) * limit;
          const [exhibits, total] = await this.exhibitsRepository.findAndCount({
            skip,
            take: limit,
          });

          const lastPage = Math.ceil(total / limit);
          const response = {
            data: exhibits,
            total,
            page: String(page),
            lastPage,
          };

          return response;
          
        } catch (error) {
          throw new BadRequestException('Error fetching exhibits');
        }
      }


}