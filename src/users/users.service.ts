import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`${password} hash: ${hashedPassword}`);

        const existingUser = await this.usersRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new BadRequestException('Пользователь с таким именем уже существует');
        }

        const user = this.usersRepository.create({ username, password: hashedPassword });

        return this.usersRepository.save(user);
    }
}
