import "reflect-metadata"
import { DataSource } from "typeorm"
import migrations from './migrationsExporter'
console.log(migrations, 'migrations')

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "shashwat",
    password: "",
    database: "financetracker",
    synchronize: false,
    logging: true,
    entities: [],
    migrations: migrations,
    subscribers: [],
})
