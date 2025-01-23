import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Create Course and Upload Document
export const createCourseWithDocument = async (req, res) => {
    const { coachId, courseName, description } = req.body;
    
    if (!coachId || !courseName) {
        return res.status(400).json({ message: 'Coach ID and Course name are required' });
    }
    
    if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
    }

    try {
        const newCourse = await prisma.course.create({
            data: {
                name: courseName,
                coaches: {
                    connect: { id: coachId },
                },
                description,
            },
        });
        const document = await prisma.document.create({
            data: {
                coachId,
                courseId: newCourse.id,
                fileName: req.file.filename,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                fileUrl: `/uploads/${req.file.filename}`,
            },
        });

        res.status(201).json({
            course: newCourse,
            document,
        });
    } catch (error) {
        console.log("Error", error);
        
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 2. Fetch All Documents for a Coach
export const getCourseDocuments = async (req, res) => {
    const { coachId } = req.params;

    try {
        // Fetch documents with related course data
        const documents = await prisma.document.findMany({
            where: { coachId },
            include: {
                course: true, // Include related course information
            },
            orderBy: { uploadDate: 'desc' }, // Order by most recent
        });

        // Enrich documents with file content
        const enrichedDocuments = documents.map((doc) => {
            const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
            const fileExists = fs.existsSync(filePath);

            return {
                ...doc,
                fileContent: fileExists ? fs.readFileSync(filePath, 'base64') : null, // Read file and encode in base64
            };
        });

        // Send the enriched documents
        res.json(enrichedDocuments);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Delete a Document by ID

export const deleteCourseAndDocuments = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }
  
    try {
      // Find the course and related documents
      const course = await prisma.course.findUnique({
        where: { id: String(id) },
        include: { documents: true }, // Include related documents
      });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }
  
      // Delete related documents first (optional, Prisma cascade will do this)
      for (const document of course.documents) {
        await prisma.document.delete({
          where: { id: document.id },
        });
      }
  
      // Now delete the course
      const deletedCourse = await prisma.course.delete({
        where: { id: String(id) },
      });
  
      return res.status(200).json({
        message: 'Course and related documents deleted successfully.',
        course: deletedCourse,
      });
    } catch (error) {
      console.error('Error deleting course and documents:', error);
  
      // Handle specific errors
      if (error.code === 'P2025') { // Prisma error code for "Record not found"
        return res.status(404).json({ message: 'Course or related documents not found.' });
      }
  
      // Handle general errors
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  export const downloadDocument = async (req, res) => {
    const { fileName } = req.params;
  
    try {
      const filePath = path.join(__dirname, '..', 'uploads', fileName);
  
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      // Send the file for download
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Error while downloading file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
      });
    } catch (error) {
      console.error('Error in downloadDocument:', error);
      res.status(500).json({ message: 'Internal server error' });
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
