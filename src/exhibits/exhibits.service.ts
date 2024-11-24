import { BadRequestException, Injectable } from '@nestjs/common';
import { Exhibit } from './exhibits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import * as path from 'path';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as multer from 'multer';

@Injectable()
export class ExhibitsService {
    constructor(
        @InjectRepository(Exhibit)
        private exhibitsRepository: Repository<Exhibit>,
    ) { }

    async create(file: Express.Multer.File, description: string, userId: number): Promise<Exhibit> {
        const uploadsDir = path.join(__dirname, '../../..', 'uploads');

        console.log(uploadsDir);

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

    
        const uniqueFileName = `${v4()}-${file.originalname}`;
        const filePath = path.join(uploadsDir, uniqueFileName);
    
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


}
