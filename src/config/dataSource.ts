import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "shashwat",
  "password": "",
  "database": "financetracker",
  "logging": true,
  "migrations": ["./src/migration/data/*.ts"],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
export {AppDataSource}