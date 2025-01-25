import express from 'express';
import { deleteStudent, getAllMentors, getAllStudents, updateCoachApproval } from '../controllers/adminController.js';
export const adminRouter = express.Router();

adminRouter.get('/mentors', getAllMentors)
adminRouter.put('/mentor/:coachId', updateCoachApproval)
adminRouter.get('/students', getAllStudents)
adminRouter.delete('/student/:studentId', deleteStudent)