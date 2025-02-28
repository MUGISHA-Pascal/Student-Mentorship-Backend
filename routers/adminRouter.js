import express from 'express';
import { approveMentor, approveStudent, deleteStudent, getAdminStatistics, getAllCoaches, getAllStudents, getApprovedCoaches, getApprovedStudents, getPendingCoaches, getPendingStudents, rejectMentor, rejectStudent, removeMentor, removeStudent, updateCoachApproval } from '../controllers/adminController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';
export const adminRouter = express.Router();


adminRouter.get("/stats", verifyToken, verifyAdmin, getAdminStatistics);

//Mentor related routes
adminRouter.get('/mentors', verifyToken, verifyAdmin, getAllCoaches)
adminRouter.get('/mentors/approved', verifyToken, verifyAdmin, getApprovedCoaches)
adminRouter.get('/mentors/pending', verifyToken, verifyAdmin, getPendingCoaches)
adminRouter.put('/mentor/:coachId', updateCoachApproval)
adminRouter.put('/mentor/approve/:id', verifyToken, verifyAdmin, approveMentor);
adminRouter.put('/mentor/remove/:id', verifyToken, verifyAdmin, removeMentor);
adminRouter.delete('/mentor/reject/:id', verifyToken, verifyAdmin, rejectMentor);

//Student related routes
adminRouter.get('/students', getAllStudents)
adminRouter.get('/students/approved', verifyToken, verifyAdmin, getApprovedStudents);
adminRouter.get('/students/pending', verifyToken, verifyAdmin, getPendingStudents);
adminRouter.put('/student/approve/:id', verifyToken, verifyAdmin, approveStudent);
adminRouter.put('/student/remove/:id', verifyToken, verifyAdmin, removeStudent);
adminRouter.delete('/student/reject/:id', verifyToken, verifyAdmin, rejectStudent);
adminRouter.delete('/student/:studentId', deleteStudent)