import { PrismaClient, ROLE, Status } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {

    // Clear existing data (optional)
    await prisma.$transaction([
        prisma.blog.deleteMany(),
        prisma.student.deleteMany(),
        prisma.coach.deleteMany(),
        prisma.admin.deleteMany(),
        prisma.user.deleteMany(),
        prisma.career.deleteMany(),
    ]);

    const password = "1234567890";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 10 random careers
    const careers = Array.from({ length: 10 }, () => ({
        title: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
    }));

    const careerRecords = await Promise.all(
        careers.map((career) =>
            prisma.career.create({ data: career })
        )
    );

    // Create 50 Approved Mentors
    const approvedMentors = [];
    for (let i = 1; i <= 50; i++) {
        console.log(`Creating approved user with email: mentor${i}@gmail.com`);
        const mentorUser = await prisma.user.create({
            data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: `mentor${i}@gmail.com`,
                dob: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' })
                    .toISOString().split('T')[0],
                gender: faker.helpers.arrayElement(["male", "female"]),
                password: hashedPassword,
                role: ROLE.MENTOR,
                approved: false,  // initially false
            },
        });

        const assignedCareer = faker.helpers.arrayElement(careerRecords);
        const mentor = await prisma.coach.create({
            data: {
                user: { connect: { id: mentorUser.id } },
                bio: faker.lorem.sentence(),
                image: faker.image.avatar(),
                career: { connect: { id: assignedCareer.id } },
            },
        });

        // Update the mentor's user record to mark as APPROVED
        await prisma.user.update({
            where: { id: mentorUser.id },
            data: { approved: true },
        });

        approvedMentors.push(mentor);
    }

    // Create 50 Pending Mentors
    const pendingMentors = [];
    for (let i = 51; i <= 100; i++) {
        console.log(`Creating pending user with email: mentor${i}@gmail.com`);
        const mentorUser = await prisma.user.create({
            data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: `mentor${i}@gmail.com`,
                dob: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' })
                    .toISOString().split('T')[0],
                gender: faker.helpers.arrayElement(["male", "female"]),
                password: hashedPassword,
                role: ROLE.MENTOR,
                approved: false,  // remain pending (default false)
            },
        });

        const assignedCareer = faker.helpers.arrayElement(careerRecords);
        const mentor = await prisma.coach.create({
            data: {
                user: { connect: { id: mentorUser.id } },
                bio: faker.lorem.sentence(),
                image: faker.image.avatar(),
                career: { connect: { id: assignedCareer.id } },
            },
        });

        // No need to update; pending mentors remain with approved: false
        pendingMentors.push(mentor);
    }

    // Create 10 Blogs
    const blogData = Array.from({ length: 10 }, () => ({
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentences(2),
        writer: "Admin",
        image: faker.image.urlPicsumPhotos(),
    }));
    await prisma.blog.createMany({ data: blogData });

    // Create one Admin
    const adminUser = await prisma.user.create({
        data: {
            firstName: "Elissa",
            lastName: "DUSABE IRADUKUNDA",
            email: "elissafirstborn@gmail.com",
            dob: "1990-01-01",
            gender: "female",
            password: hashedPassword,
            role: ROLE.ADMIN,
        },
    });
    await prisma.admin.create({
        data: {
            user: { connect: { id: adminUser.id } },
        },
    });
    console.log("Admin created successfully!");

    // Function to create students
    const createStudents = async (approvedStatus, startIndex, endIndex) => {
        for (let i = startIndex; i <= endIndex; i++) {
            console.log(`Creating student with email: student${i}@gmail.com`);
            const studentUser = await prisma.user.create({
                data: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: `student${i}@gmail.com`,
                    dob: faker.date.birthdate({ min: 1995, max: 2005, mode: 'year' })
                        .toISOString().split('T')[0],
                    gender: faker.helpers.arrayElement(["male", "female"]),
                    password: hashedPassword,
                    role: ROLE.STUDENT,
                    approved: approvedStatus,
                },
            });

            await prisma.student.create({
                data: {
                    user: { connect: { id: studentUser.id } },
                    bio: faker.lorem.sentence(),
                    educationLevel: faker.helpers.arrayElement(["High School", "Bachelor's", "Master's"]),
                    image: faker.image.avatar(),
                },
            });
        }
    };

    // Create 50 Approved Students
    await createStudents(true, 1, 50);
    // Create 50 Pending Students
    await createStudents(false, 51, 100);

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error seeding data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
