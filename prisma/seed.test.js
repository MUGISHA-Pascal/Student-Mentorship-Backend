import { PrismaClient, ROLE } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    const password = "1234567890";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 10 random careers
    const careers = Array.from({ length: 10 }, () => ({
        title: faker.person.jobTitle(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
    }));

    const careerRecords = await Promise.all(
        careers.map((career) =>
            prisma.career.create({ data: career })
        )
    );


    // Create 50 Mentors
    const mentors = [];

    for (let i = 1; i <= 50; i++) {
        console.log(`Creating user with email: mentor${i}@gmail.com`);
        const mentorUser = await prisma.user.create({
            data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                dob: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }).toISOString().split('T')[0],
                gender: faker.helpers.arrayElement(["male", "female"]),
                password: hashedPassword,
                role: ROLE.MENTOR,
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

        mentors.push(mentor);
    }

    const mentorsWithExperience = faker.helpers.arrayElements(mentors, 20);

    for (const mentor of mentorsWithExperience) {
        const experiences = Array.from({ length: faker.number.int({ min: 2, max: 3 }) }, () => {
            const startDate = faker.date.past({ years: 10 });
            const endDate = faker.date.between({ from: startDate, to: new Date() }); 
            return {
                company: faker.company.name(),
                position: faker.person.jobTitle(),
                startDate: startDate,
                endDate: endDate,
                coachId: mentor.id,
            };
        });

        await prisma.workExperience.createMany({ data: experiences });
    }

    // Create 10 Blogs
    const blogData = Array.from({ length: 10 }, () => ({
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentences(2),
        writer: "Admin",
        image: faker.image.urlPicsumPhotos(),
    }));

    await prisma.blog.createMany({ data: blogData });

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
