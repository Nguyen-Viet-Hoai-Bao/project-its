import { DataSourceOptions } from "typeorm";

export const AppDataSource: DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "locallibrary",
    synchronize: true,
    logging: false,
    entities: ["src/entity/*.entity.ts"],
    migrations: [],
    subscribers: [],
};