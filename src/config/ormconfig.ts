import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'locallibrary',
  synchronize: false, // Set synchronize to false to prevent automatic database schema sync
  logging: true,
  entities: ['./src/entities/*.ts'],
  migrations: ['./src/migrations/*.ts'],
  cli: {
    migrationsDir: './src/migrations',
  },
  migrationsRun: true, // Enable auto migration runs
  autoLoadEntities: true, // Automatically load entities from the entities path
};

export default config;
