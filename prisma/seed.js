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

  // Create Blogs
  const blogData = [
    {
      title: "First Blog",
      description: "This is the description for the first blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Second Blog",
      description: "This is the description for the second blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Third Blog",
      description: "This is the description for the third blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Fourth Blog",
      description: "This is the description for the fourth blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Fifth Blog",
      description: "This is the description for the fifth blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Sixth Blog",
      description: "This is the description for the sixth blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Seventh Blog",
      description: "This is the description for the seventh blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Eighth Blog",
      description: "This is the description for the eighth blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    },
    {
      title: "Ninth Blog",
      description: "This is the description for the ninth blog.",
      writer: "Admin",
      image: "https://assets.everspringpartners.com/dims4/default/4999f8a/2147483647/strip/true/crop/620x251+0+0/resize/620x251!/format/webp/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F50%2F43%2F08168c84400db8cb812ccd961e4d%2Fadobestock-439234053-mumimcoaching-620x250.jpeg"
    }
  ];

  // Insert blogs into the database
  for (const blog of blogData) {
    await prisma.blog.create({
      data: blog,
    });
  }

  console.log("Blogs seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
