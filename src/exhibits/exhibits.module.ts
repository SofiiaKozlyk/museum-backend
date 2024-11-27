import { Module } from '@nestjs/common';
import { ExhibitsController } from './exhibits.controller';
import { ExhibitsService } from './exhibits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibit } from './exhibits.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibit, User, Comment])],
  controllers: [ExhibitsController],
  providers: [ExhibitsService]
})
export class ExhibitsModule {}
