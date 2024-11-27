import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exhibit } from 'src/exhibits/exhibits.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Exhibit)
        private readonly exhibitsRepository: Repository<Exhibit>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async createComment(createCommentDto: CreateCommentDto, exhibitId: number, userId: number) {
        const exhibit = await this.exhibitsRepository.findOne({ where: { id: exhibitId } });
        if (!exhibit) {
            throw new NotFoundException('Exhibit not found');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const comment = this.commentsRepository.create({
            text: createCommentDto.text,
            exhibit,
            user,
        });

        await this.commentsRepository.save(comment);
        exhibit.commentCount += 1;
        await this.exhibitsRepository.save(exhibit);

        return comment;
    }

    async getCommentsByExhibitId(exhibitId: number): Promise<Comment[]> {
        const comment = await this.commentsRepository.find({
            where: { exhibit: {id: exhibitId} },
            relations: ['user']
        });

        if (!comment) {
            throw new NotFoundException(`Comments for exhibit with ID ${exhibitId} not found`);
        }

        return comment;
    }

}
