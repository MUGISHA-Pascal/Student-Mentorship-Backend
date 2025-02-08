import express from 'express';
import { deleteStudent, getAdminStatistics, getAllMentors, getAllStudents, updateCoachApproval } from '../controllers/adminController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';
export const adminRouter = express.Router();

adminRouter.get('/mentors', getAllMentors)
adminRouter.put('/mentor/:coachId', updateCoachApproval)
adminRouter.get('/students', getAllStudents)
adminRouter.delete('/student/:studentId', deleteStudent)
adminRouter.get("/stats",verifyToken, verifyAdmin, getAdminStatistics);