import { DataSource } from 'typeorm'
import { join } from 'path'
import dotenv from 'dotenv'
dotenv.config()

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env
const PORT = DB_PORT ? parseInt(DB_PORT) : 3306

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  logging: false,
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
  entities: [join(__dirname, '../entity/*.entity.{ts,js}')],
  synchronize: false
})

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