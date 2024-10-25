import express from 'express';
import { 
    uploadCourseDocument, 
    getCourseDocuments, 
    deleteDocument, 
    filterDocuments, 
    searchDocuments 
} from '../controllers/documentController';
import multer from 'multer';

export const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

// Document Management Routes
documentRouter.post('/upload-course-doc', upload.single('file'), uploadCourseDocument);
documentRouter.get('/get-course-docs/:coachId', getCourseDocuments);
documentRouter.delete('/delete-course-doc/:id', deleteDocument);
documentRouter.get('/filter-course-docs', filterDocuments);
documentRouter.get('/search-course-docs', searchDocuments);

