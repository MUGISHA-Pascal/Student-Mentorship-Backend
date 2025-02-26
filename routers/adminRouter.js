import express from 'express';
import { approveMentor, deleteStudent, getAdminStatistics, getAllCoaches, getAllStudents, rejectMentor, removeMentor, updateCoachApproval } from '../controllers/adminController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';
export const adminRouter = express.Router();


adminRouter.get("/stats", verifyToken, verifyAdmin, getAdminStatistics);

//Mentor related routes
adminRouter.get('/mentors', verifyToken, verifyAdmin, getAllCoaches)
adminRouter.put('/mentor/:coachId', updateCoachApproval)
adminRouter.put('/mentor/approve/:id', verifyToken, verifyAdmin, approveMentor);
adminRouter.put('/mentor/remove/:id', verifyToken, verifyAdmin, removeMentor);
adminRouter.delete('/mentor/reject/:id', verifyToken, verifyAdmin, rejectMentor);

//Student related routes
adminRouter.get('/students', getAllStudents)
adminRouter.delete('/student/:studentId', deleteStudent)