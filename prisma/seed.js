import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Courses
  const course1 = await prisma.course.create({
    data: { name: 'Introduction to Programming' },
  });

  const course2 = await prisma.course.create({
    data: { name: 'Advanced Data Structures' },
  });

  // Seed Careers
  const career1 = await prisma.career.create({
    data: {
      title: 'Software Engineer',
      description: 'Develops software applications.',
    },
  });

  const career2 = await prisma.career.create({
    data: {
      title: 'Data Scientist',
      description: 'Analyzes data to provide insights.',
    },
  });

  // Seed Coaches with unique emails
  const coach1 = await prisma.coach.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'unique-coach1@example.com', // Ensure this email is unique
      bio: 'Experienced Software Engineer.',
      image: 'https://example.com/coach-a.jpg',
      career: { connect: [{ id: career1.id }] },
      courses: { connect: [{ id: course1.id }, { id: course2.id }] },
    },
  });

  const coach2 = await prisma.coach.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'unique-coach2@example.com', // Ensure this email is unique
      bio: 'Passionate Data Scientist.',
      image: 'https://example.com/coach-b.jpg',
      career: { connect: [{ id: career2.id }] },
      courses: { connect: [{ id: course1.id }] },
    },
  });

  // The rest of your seed data remains the same
  const student1 = await prisma.student.create({
    data: {
      name: 'Student X',
      status: 'APPROVED',
      courses: { connect: [{ id: course1.id }] },
      coaches: { connect: [{ id: coach1.id }] },
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: 'Student Y',
      status: 'WAITLIST',
      courses: { connect: [{ id: course2.id }] },
      coaches: { connect: [{ id: coach2.id }] },
    },
  });

  // Add other seed data here...

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
