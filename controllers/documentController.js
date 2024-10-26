import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Upload Course Document
export const uploadCourseDocument = async (req, res) => {
    const { coachId, courseId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    try {
        const document = await prisma.document.create({
            data: {
                coachId,
                courseId,
                fileName: req.file.filename,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                fileUrl: `/uploads/${req.file.filename}`,
            },
        });
        res.status(201).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 2. Fetch All Documents for a Coach
export const getCourseDocuments = async (req, res) => {
    const { coachId } = req.params;
    try {
        const documents = await prisma.document.findMany({
            where: { coachId },
            orderBy: { uploadDate: 'desc' },
        });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Delete a Document by ID
export const deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.document.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 4. Filter and Sort Documents
export const filterDocuments = async (req, res) => {
    const { coachId, fileType, sortBy } = req.query;
    try {
        const documents = await prisma.document.findMany({
            where: { coachId, fileType },
            orderBy: { uploadDate: sortBy === 'date' ? 'desc' : 'asc' },
        });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 5. Search Documents by Term
export const searchDocuments = async (req, res) => {
    const { term, coachId } = req.query;
    try {
        const documents = await prisma.document.findMany({
            where: {
                coachId,
                fileName: { contains: term, mode: 'insensitive' },
            },
        });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
