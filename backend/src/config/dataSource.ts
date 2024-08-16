import { DataSource } from "typeorm"

const dataSource = new DataSource({
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "shashwat",
  "password": "",
  "database": "financetracker",
  "logging": true,
  "migrations": ["./src/migration/data/*.ts"],
})


export {dataSource}