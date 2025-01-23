import express from 'express';
import { 
    getCourseDocuments,
    filterDocuments, 
    searchDocuments, 
    createCourseWithDocument,
    deleteCourseAndDocuments,
    downloadDocument
} from '../controllers/documentController.js';
import multer from 'multer';

export const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

// Document Management Routes
documentRouter.post('/upload-course-doc', upload.single('file'), createCourseWithDocument);
documentRouter.get('/get-course-docs/:coachId', getCourseDocuments);
documentRouter.delete('/delete-course-doc/:id', deleteCourseAndDocuments);
documentRouter.get('/download-course-doc/:fileName', downloadDocument);
documentRouter.get('/filter-course-docs', filterDocuments);
documentRouter.get('/search-course-docs', searchDocuments);

