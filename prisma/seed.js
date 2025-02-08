import { PrismaClient, ROLE } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = "1234567890";
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  // Create Student 1
  const studentUser1 = await prisma.user.create({
    data: {
      firstName: "Elissa",
      lastName: "Firstborn",
      email: "elissafirstborn@gmail.com",
      dob: "2005-01-01",
      gender: "male",
      password: hashedPassword, // Store hashed password
      role: ROLE.STUDENT,
    },
  });

  // Create a corresponding student profile
  await prisma.student.create({
    data: {
      userId: studentUser1.id,
    },
  });

  // Create Student 2
  const studentUser2 = await prisma.user.create({
    data: {
      firstName: "Elissa",
      lastName: "Dusabe",
      email: "elissadusabe@gmail.com",
      dob: "2004-05-15",
      gender: "male",
      password: hashedPassword, // Store hashed password
      role: ROLE.STUDENT,
    },
  });

  await prisma.student.create({
    data: {
      userId: studentUser2.id,
    },
  });

  // Create Mentor
  const mentorUser = await prisma.user.create({
    data: {
      firstName: "Dusabe",
      lastName: "Elissa",
      email: "dusabeelissa05@gmail.com",
      dob: "2003-03-20",
      gender: "male",
      password: hashedPassword, // Store hashed password
      role: ROLE.MENTOR,
    },
  });

  await prisma.coach.create({
    data: {
      userId: mentorUser.id,
      bio: "Experienced mentor in her field.",
      image: "https://example.com/mentor.jpg",
    },
  });

  console.log("Users seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
