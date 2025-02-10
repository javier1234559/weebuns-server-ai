require('dotenv').config();
const { exec } = require('child_process');
const { parse } = require('pg-connection-string');
const util = require('util');
const execPromise = util.promisify(exec);

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

const restoreCommand = `PGPASSWORD=${dbPassword} psql -h ${config.host} -U ${config.user} -d ${config.database} -p ${config.port || 5432} --no-password -f prisma/backup/database_backup.sql`;

async function restoreDatabase() {
  try {
    // First, get the list of tables
    const getTablesCommand = `PGPASSWORD=${dbPassword} psql -h ${config.host} -U ${config.user} -d ${config.database} -p ${config.port || 5432} -t -A -c "SELECT string_agg(quote_ident(tablename), ', ') FROM pg_tables WHERE schemaname='public'"`;
    
    const { stdout: tables } = await execPromise(getTablesCommand);
    
    if (!tables.trim()) {
      console.log('No tables found to truncate.');
      return;
    }

    // Then truncate the tables
    const truncateCommand = `PGPASSWORD=${dbPassword} psql -h ${config.host} -U ${config.user} -d ${config.database} -p ${config.port || 5432} -c "TRUNCATE TABLE ${tables.trim()} CASCADE"`;
    await execPromise(truncateCommand);
    console.log('Database cleaned (all data truncated).');

    // Finally restore the backup
    await execPromise(restoreCommand);
    console.log('Restore completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

restoreDatabase();