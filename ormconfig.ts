import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'locallibrary',
  synchronize: false,
  logging: true, 
  entities: ['./src/entities/*.ts'],
  migrations: ['./src/migrations/*.ts'],
  cli: {
    migrationsDir: './src/migrations', // Thư mục để lưu trữ các file migration
  },
};

export default config;
