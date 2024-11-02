import { execSync } from 'child_process';
const migrationType = process.argv[2];
const migrationName = process.argv[3];
if (!migrationName || !migrationType) {
  console.error('Error: Please provide a table name.');
  process.exit(1);
}
const command = `npx typeorm migration:create src/migrations/${migrationType}/${migrationName}`;
try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('failed to create migration:', error);
  process.exit(1);
}
