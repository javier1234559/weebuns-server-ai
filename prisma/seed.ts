import { PrismaClient } from '@prisma/client';
import {
  referenceData,
  users,
  createTeacherProfiles,
  createStudentProfiles,
  createLessons,
  createVocabularies,
  createComments,
  createNotifications,
  createStudyActivities,
  generatedIds,
  tokenPackages,
  createTokenWallet,
  createTransaction,
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
    console.log(`Creating reference data: ${data.type} - ${data.code}`);
    const ref = await prisma.referenceData.create({
      data: data,
    });
    generatedIds.referenceData.push(ref.id);
  }
  console.log('Reference data created:', generatedIds.referenceData);
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
  const lessons = createLessons(generatedIds.users);
  for (const lesson of lessons) {
    console.log(
      `Creating lesson with level: ${lesson.level}, topic: ${lesson.topic}`,
    );
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

async function seedComments() {
  console.log('Seeding comments...');
  const comments = createComments(generatedIds.users);
  let parentCommentId: string | null = null;

  for (const comment of comments) {
    const createdComment = await prisma.comment.create({
      data: {
        ...comment,
        parentId: comment.parentId === 'comment-1' ? parentCommentId : null,
      },
    });
    generatedIds.comments.push(createdComment.id);

    // Save the first comment's ID for the reply
    if (!parentCommentId) {
      parentCommentId = createdComment.id;
    }
  }
  console.log(`Created ${generatedIds.comments.length} comments`);
}

async function seedNotifications() {
  console.log('Seeding notifications...');
  const notifications = createNotifications(generatedIds.users);

  for (const notification of notifications) {
    const createdNotification = await prisma.notification.create({
      data: notification,
    });
    generatedIds.notifications.push(createdNotification.id);
  }
  console.log(`Created ${generatedIds.notifications.length} notifications`);
}

async function seedStudyActivities() {
  console.log('Seeding study activities...');
  const studyActivities = createStudyActivities(generatedIds.users);

  for (const activity of studyActivities) {
    const createdActivity = await prisma.studyActivity.create({
      data: activity,
    });
    generatedIds.studyActivities.push(createdActivity.id);
  }
  console.log(
    `Created ${generatedIds.studyActivities.length} study activities`,
  );
}

async function seedTokenPackages() {
  console.log('Seeding token packages...');
  for (const packageData of tokenPackages) {
    const tokenPackage = await prisma.tokenPackage.create({
      data: packageData,
    });
    generatedIds.tokenPackages.push(tokenPackage.id);
  }
  console.log(`Created ${generatedIds.tokenPackages.length} token packages`);
}

async function seedTokenWallet() {
  console.log('Seeding token wallet...');
  const tokenWallet = await prisma.tokenWallet.create({
    data: createTokenWallet(generatedIds.users),
  });
  generatedIds.tokenWallets.push(tokenWallet.id);
  console.log('Created token wallet');
}

async function seedTransaction() {
  console.log('Seeding transaction...');
  const standardPackage = await prisma.tokenPackage.findUnique({
    where: { code: 'standard' },
  });

  if (!standardPackage) {
    throw new Error('Standard package not found');
  }

  const transaction = await prisma.transaction.create({
    data: createTransaction(generatedIds.users, standardPackage.id),
  });
  generatedIds.transactions.push(transaction.id);
  console.log('Created transaction');
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

    // User activities
    await seedComments();
    await seedNotifications();
    await seedStudyActivities();

    // Token system
    await seedTokenPackages();
    await seedTransaction();
    await seedTokenWallet();

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
