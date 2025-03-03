import { PrismaClient } from '@prisma/client';
import {
  referenceData,
  users,
  createTeacherProfiles,
  createStudentProfiles,
  createLessons,
  createVocabularies,
  generatedIds,
} from './data';

const prisma = new PrismaClient();

// Clean database function
async function cleanDatabase() {
  console.log('Cleaning database...');
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`);

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables.join(',')} CASCADE;`,
    );
    console.log('Database cleaned successfully');
  } catch (error) {
    console.log('Error cleaning database:', error);
  }
}

// Individual seed functions
async function seedReferenceData() {
  console.log('Seeding reference data...');
  for (const data of referenceData) {
    const ref = await prisma.referenceData.create({
      data: data,
    });
    generatedIds.referenceData.push(ref.id);
  }
  console.log(
    `Created ${generatedIds.referenceData.length} reference data entries`,
  );
}

async function seedUsers() {
  console.log('Seeding users...');
  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    generatedIds.users.push(user.id);
  }
  console.log(`Created ${generatedIds.users.length} users`);
}

async function seedTeacherProfiles() {
  console.log('Seeding teacher profiles...');
  const teacherProfiles = createTeacherProfiles(generatedIds.users);
  for (const profile of teacherProfiles) {
    const teacherProfile = await prisma.teacherProfile.create({
      data: profile,
    });
    generatedIds.teacherProfiles.push(teacherProfile.id);
  }
  console.log(
    `Created ${generatedIds.teacherProfiles.length} teacher profiles`,
  );
}

async function seedStudentProfiles() {
  console.log('Seeding student profiles...');
  const studentProfiles = createStudentProfiles(generatedIds.users);
  for (const profile of studentProfiles) {
    const studentProfile = await prisma.studentProfile.create({
      data: profile,
    });
    generatedIds.studentProfiles.push(studentProfile.id);
  }
  console.log(
    `Created ${generatedIds.studentProfiles.length} student profiles`,
  );
}

async function seedLessons() {
  console.log('Seeding lessons...');
  const lessons = createLessons(generatedIds.users, generatedIds.referenceData);
  for (const lesson of lessons) {
    const createdLesson = await prisma.lesson.create({
      data: lesson,
    });
    generatedIds.lessons.push(createdLesson.id);
  }
  console.log(`Created ${generatedIds.lessons.length} lessons`);
}

async function seedVocabularies() {
  console.log('Seeding vocabularies...');
  const vocabularies = createVocabularies(generatedIds.users);
  for (const vocab of vocabularies) {
    const vocabulary = await prisma.vocabulary.create({
      data: vocab,
    });
    generatedIds.vocabularies.push(vocabulary.id);
  }
  console.log(`Created ${generatedIds.vocabularies.length} vocabularies`);
}

// Main seed function
async function seedAll() {
  try {
    await cleanDatabase();

    // Basic data
    await seedReferenceData();
    await seedUsers();

    // Profiles
    await seedTeacherProfiles();
    await seedStudentProfiles();

    // Content
    await seedLessons();
    await seedVocabularies();

    console.log('Database seeded successfully');
    console.log('Generated IDs:', generatedIds);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seeding
seedAll()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
