import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Courses
  const course1 = await prisma.course.create({
    data: { name: 'Introduction to Programming' }
  });
  const course2 = await prisma.course.create({
    data: { name: 'Advanced Data Structures' }
  });

  // Seed Careers
  const career1 = await prisma.career.create({
    data: { title: 'Software Engineer', description: 'Develops software applications.' }
  });

  const career2 = await prisma.career.create({
    data: { title: 'Data Scientist', description: 'Analyzes data to provide insights.' }
  });

  // Seed Coaches (with unique emails)
  const coach1 = await prisma.coach.create({
    data: { 
      firstName: 'John', 
      lastName: 'Doe',   
      email: 'coach1-unique@example.com', // Updated email to be unique
      image: 'https://example.com/coach-a.jpg',
      career: {
        connect: { id: career1.id }
      },
      courses: {
        connect: [{ id: course1.id }, { id: course2.id }]
      }
    }
  });
  
  const coach2 = await prisma.coach.create({
    data: { 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'coach2-unique@example.com', // Updated email to be unique
      image: 'https://example.com/coach-b.jpg',
      career: {
        connect: { id: career2.id }
      },
      courses: {
        connect: [{ id: course1.id }]
      }
    }
  });
  

  // Seed Students
  const student1 = await prisma.student.create({
    data: {
      name: 'Student X',
      status: 'APPROVED',
      courses: {
        connect: [{ id: course1.id }]
      },
      coaches: {
        connect: [{ id: coach1.id }]
      }
    }
  });

  const student2 = await prisma.student.create({
    data: {
      name: 'Student Y',
      status: 'WAITLIST',
      courses: {
        connect: [{ id: course2.id }]
      },
      coaches: {
        connect: [{ id: coach2.id }]
      }
    }
  });

  // Seed Activities
  await prisma.activity.create({
    data: {
      name: 'Coding Bootcamp',
      date: new Date(),
      status: 'UPCOMING',
      coachId: coach1.id,
      image: 'https://example.com/activity.jpg'
    }
  });

  // Seed Documents
  await prisma.document.create({
    data: {
      coachId: coach1.id,
      courseId: course1.id,
      fileName: 'Lesson_Plan.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      fileUrl: 'https://example.com/lesson-plan.pdf'
    }
  });

  // Seed Messages
  await prisma.message.create({
    data: {
      studentId: student1.id,
      content: 'Looking forward to the next session!'
    }
  });

  // Seed Student Ratings for Coaches (after students and coaches are created)
  await prisma.rating.create({
    data: {
      rating: 4.5,  // Rating value for coach 1
      studentId: student1.id,
      coachId: coach1.id,
    }
  });

  await prisma.rating.create({
    data: {
      rating: 4.0,  // Rating value for coach 2
      studentId: student2.id,
      coachId: coach2.id,
    }
  });

  // Seed Work Experience for Coaches
  await prisma.workExperience.create({
    data: {
      position: 'Senior Software Developer',
      company: 'Tech Solutions Inc.',
      startDate: new Date('2015-01-01'),
      endDate: new Date('2020-12-31'),
      coachId: coach1.id,
    }
  });

  await prisma.workExperience.create({
    data: {
      position: 'Junior Data Scientist',
      company: 'Data Insights LLC',
      startDate: new Date('2018-03-01'),
      endDate: new Date('2022-08-31'),
      coachId: coach2.id,
    }
  });

  // You can add more work experience entries for other coaches as needed.
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
