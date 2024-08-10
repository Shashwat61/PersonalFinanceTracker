import { execSync } from "child_process";
console.log(process.argv)
const tableName = process.argv[2]
if (!tableName) {
    console.error('Error: Please provide a table name.');
    process.exit(1);
  }
const command = `npx typeorm migration:create src/migrations/${tableName}`; 
try{
    execSync(command, {stdio: "inherit"})
}catch(error){
    console.error("failed to create migration:", error)
    process.exit(1)
}