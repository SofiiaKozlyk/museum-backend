import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module'; 
// import { DemoProtectedRouteModule } from './demo-protected-route/demo-protected-route.module';

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
  }),
    AuthModule,
    UsersModule,
    // DemoProtectedRouteModule
  ]
})
export class AppModule { }
