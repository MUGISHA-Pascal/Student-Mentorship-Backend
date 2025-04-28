import { PrismaClient } from "@prisma/client";
import { Prisma } from '@prisma/client'; 
const prisma = new PrismaClient();

export const createCohort = async (req, res) => {
    const { name, careerId, startDate, endDate, capacity, status } = req.body;

    if (!name || !careerId || !startDate || !endDate || !capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isNaN(capacity) || Number(capacity) <= 0) {
        return res.status(400).json({ error: 'Capacity must be a positive number' });
    }

    try {
        const career = await prisma.career.findUnique({
            where: { id: careerId },
        });

        if (!career) {
            return res.status(404).json({ error: 'Career with provided careerId does not exist' });
        }

        // 5. Create the cohort
        const cohort = await prisma.cohort.create({
            data: {
                name,
                careerId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                capacity: Number(capacity),
                status: status || undefined,
            },
        });

        res.status(201).json({ message: 'Cohort created successfully', cohort });

    } catch (error) {
        console.error('Error creating cohort:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Cohort with the same name already exists' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllCohorts = async (req, res) => {
    try {
        const cohorts = await prisma.cohort.findMany({
            include: {
                career: true,
                enrollments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({ cohorts });
    } catch (error) {
        console.error('Error fetching cohorts:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCohortById = async (req, res) => {
    const { id } = req.params;

    try {
        const cohort = await prisma.cohort.findUnique({
            where: { id },
            include: {
                career: true,
                enrollments: true,
            },
        });

        if (!cohort) {
            return res.status(404).json({ error: 'Cohort not found' });
        }

        res.status(200).json({ cohort });
    } catch (error) {
        console.error('Error fetching cohort by id:', error);
        res.status(500).json({ error: error.message });
    }
};

export const editCohort = async (req, res) => {
    const { id } = req.params;
    const { name, careerId, startDate, endDate, capacity, status } = req.body;

    // 1. Validate id param
    if (!id) {
        return res.status(400).json({ error: 'Missing cohort ID in parameters' });
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: 'startDate must be before endDate' });
    }

    // 3. Validate capacity if provided
    if (capacity && (isNaN(capacity) || Number(capacity) <= 0)) {
        return res.status(400).json({ error: 'Capacity must be a positive number' });
    }

    try {
        const cohort = await prisma.cohort.findUnique({ where: { id } });
        if (!cohort) {
            return res.status(404).json({ error: 'Cohort not found' });
        }

        if (careerId) {
            const career = await prisma.career.findUnique({
                where: { id: careerId },
            });

            if (!career) {
                return res.status(404).json({ error: 'Career with provided careerId does not exist' });
            }
        }

        const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
        if (status !== undefined && !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (careerId !== undefined) updateData.careerId = careerId;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (capacity !== undefined) updateData.capacity = Number(capacity);
        if (status !== undefined) updateData.status = status;

        // 7. Update the cohort
        const updatedCohort = await prisma.cohort.update({
            where: { id },
            data: updateData,
        });

        res.status(200).json({ message: 'Cohort updated successfully', cohort: updatedCohort });

    } catch (error) {
        console.error('Error updating cohort:', error);

        // Handle known Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Cohort not found during update' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCohort = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.cohort.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Cohort deleted successfully' });
    } catch (error) {
        console.error('Error deleting cohort:', error);
        res.status(500).json({ error: error.message });
    }
};
