require('dotenv').config();
const { exec } = require('child_process');
const { parse } = require('pg-connection-string');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const config = parse(dbUrl);

const dbPassword = config.password;

if (!dbPassword) {
  console.error('Password not found in DATABASE_URL');
  process.exit(1);
}

const backupCommand = `PGPASSWORD=${dbPassword} pg_dump -h ${config.host} -U ${config.user} -d ${config.database} -p ${config.port || 5432} --no-password > prisma/backup/database_backup.sql`;

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during backup: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log('Backup completed successfully!');
});
