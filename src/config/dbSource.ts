import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "shashwat",
    "password": "",
    "database": "financetracker",
    "logging": true,
    "entities": ["./src/entity/*.ts"],
    "migrations": ["./src/migrations/db/*.ts"],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
export {AppDataSource}