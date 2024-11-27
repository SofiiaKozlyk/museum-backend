import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Exhibit } from 'src/exhibits/exhibits.entity';
import { Comment } from 'src/comments/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Exhibit, Comment])],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService]
})
export class UsersModule {}
