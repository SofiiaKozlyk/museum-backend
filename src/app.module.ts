import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "museum",
    password: "museum",
    database: "museum_db",
    entities: [User],
    synchronize: false,
  }), UsersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
