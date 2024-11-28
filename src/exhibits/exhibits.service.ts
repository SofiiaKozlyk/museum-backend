import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Exhibit } from './exhibits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitDto } from './dto/create-exhibit.dto';
import * as path from 'path';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as multer from 'multer';
import { PaginatedExhibits } from 'src/types/PaginatedExhibits';

@Injectable()
export class ExhibitsService {
  constructor(
    @InjectRepository(Exhibit)
    private exhibitsRepository: Repository<Exhibit>,
  ) { }

  async create(file: Express.Multer.File, description: string, userId: number): Promise<Exhibit> {
    const uploadsDir = path.join(__dirname, '../..', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueFileName = `${v4()}${path.extname(file.originalname)}`;
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

  async getExhibits(page: number, limit: number): Promise<PaginatedExhibits> {
    try {
      if (!page || page <= 0) {
        page = 1;
      }

      if (!limit || limit <= 0) {
        limit = 1;
      }

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

  async getExhibitById(id: number): Promise<Exhibit | undefined> {
    const exhibit = await this.exhibitsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    return exhibit;
  }

  async deleteExhibitById(id: number, userId: number): Promise<{ message: string }> {
    const exhibit = await this.getExhibitById(id);

    if (!exhibit) {
      throw new NotFoundException(`Exhibit with id ${id} not found`);
    }

    if (exhibit.user.id !== userId) {
      throw new ForbiddenException(`You are not the author of this exhibit`);
    }

    const filePath = path.join(__dirname, '../../uploads', path.basename(exhibit.imageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.exhibitsRepository.remove(exhibit);

    return { message: 'Exhibit successfully deleted' };
  }
}
