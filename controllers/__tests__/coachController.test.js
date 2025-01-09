import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../index';
const prisma = new PrismaClient();

describe('POST /coaches/:id/activities', () => {
    let coachId;

    // Setup: create a coach before running tests
    beforeAll(async () => {
        const coach = await prisma.coach.create({
            data: {
                firstName: 'Test',
                lastName: 'Coach',
                email: 'testcoach@example.com',
            },
        });
        coachId = coach.id;
    });

    afterAll(async () => {
        // Clean up: delete test coach after tests are done
        await prisma.coach.delete({ where: { id: coachId } });
        await prisma.$disconnect();
    });

    // Test 1: Successful creation of activity
    it('should create a new activity for a coach', async () => {
        const activityData = {
            name: 'Test Activity',
            date: new Date().toISOString(),  // Valid ISO date string
            status: 'Upcoming',
        };

        const res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send(activityData);

        expect(res.status).toBe(201); // HTTP status code 201 for created
        expect(res.body.name).toBe('Test Activity');
        expect(res.body.date).toBe(activityData.date);
        expect(res.body.status).toBe('Upcoming');
    });

    // Test 2: Missing required fields
    it('should return 400 if required fields are missing', async () => {
        // Case 1: Missing activity name
        let res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send({ date: new Date().toISOString(), status: 'Upcoming' });
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Activity name, date, and status are required');

        // Case 2: Missing date
        res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send({ name: 'Test Activity', status: 'Upcoming' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Activity name, date, and status are required');

        // Case 3: Missing status
        res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send({ name: 'Test Activity', date: new Date().toISOString() });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Activity name, date, and status are required');
    });

    // Test 3: Invalid date format
    it('should return 400 if the date format is invalid', async () => {
        const invalidDate = 'invalid-date';
        const activityData = {
            name: 'Test Activity',
            date: invalidDate,
            status: 'Upcoming',
        };

        const res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send(activityData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid date format');
    });

    // Test 4: Invalid status value
    it('should return 400 if the status is invalid', async () => {
        const activityData = {
            name: 'Test Activity',
            date: new Date().toISOString(),
            status: 'InvalidStatus',  // Invalid status
        };

        const res = await request(app)
            .post(`/coaches/${coachId}/activities`)
            .send(activityData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid status value');
    });

    // Test 5: Coach not found
    it('should return 404 if coach not found', async () => {
        const activityData = {
            name: 'Test Activity',
            date: new Date().toISOString(),
            status: 'Upcoming',
        };

        const res = await request(app)
            .post(`/coaches/99999/activities`)  // Invalid coach ID
            .send(activityData);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Coach not found');
    });
});
