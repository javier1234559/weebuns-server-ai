import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupTimescaleDB() {
  try {
    // Enable TimescaleDB
    await prisma.$executeRaw`
      CREATE EXTENSION IF NOT EXISTS timescaledb;
    `;

    // // Create table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS user_activities (
        time TIMESTAMPTZ NOT NULL,
        user_id UUID NOT NULL,
        activity_count INT DEFAULT 1,
        streak_count INT DEFAULT 0,
        PRIMARY KEY(time, user_id)
      );
    `;

    // Convert to hypertable
    await prisma.$executeRaw`
      SELECT create_hypertable('user_activities', 'time', 
        if_not_exists => TRUE,
        migrate_data => TRUE
      );
    `;

    // Add index
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_user_activities_user_time 
      ON user_activities(user_id, time DESC);
    `;

    console.log('TimescaleDB setup completed successfully');
  } catch (error) {
    console.error('Error setting up TimescaleDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTimescaleDB();
