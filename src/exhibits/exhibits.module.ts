import { Module } from '@nestjs/common';
import { ExhibitsController } from './exhibits.controller';
import { ExhibitsService } from './exhibits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibit } from './exhibits.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Exhibit, User, Comment])],
  controllers: [ExhibitsController],
  providers: [ExhibitsService, NotificationsGateway]
})
export class ExhibitsModule {}
