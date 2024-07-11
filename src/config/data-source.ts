import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ["src/entity/*.entity.{ts, js}"],
    synchronize: true,
    logging: false,
    migrations: ["src/migration/*.{ts, js}"],
    subscribers: ["src/subscriber/*.{ts, js}"],
    });

// // src/config/data-source.ts
// import { createConnection, getConnection, Connection } from 'typeorm';

// let connection: Connection;

// export const initializeDatabase = async () => {
//   try {
//     connection = await createConnection({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: '',
//       database: 'locallibrary',
//       entities: ["src/entity/*.entity.ts"],
//       synchronize: true, // Chỉ sử dụng trong môi trường development
//       logging: true,
//     });
//     console.log('Database connected');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };

// export const getAppConnection = () => {
//   if (!connection) {
//     throw new Error('Database connection has not been initialized.');
//   }
//   return connection;
// };