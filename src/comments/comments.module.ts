import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Exhibit } from 'src/exhibits/exhibits.entity';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibit, User, Comment])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
