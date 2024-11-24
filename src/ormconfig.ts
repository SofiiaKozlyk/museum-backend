import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Exhibit } from './exhibits/exhibits.entity';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "museum",
    password: "museum",
    database: "museum_db",
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    entities: [User, Exhibit],
});
