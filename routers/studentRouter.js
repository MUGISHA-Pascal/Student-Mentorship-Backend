import express from 'express';
import { 
    getStudentsList, 
    getStudentProfile, 
    getWaitlist, 
    approveWaitlistStudent, 
    rejectWaitlistStudent, 
    sendMessageToStudent, 
    removeStudent 
} from '../controllers/studentController.js';

export const studentRouter = express.Router();

// 1. Retrieve a list of students
studentRouter.get('/students-list', getStudentsList);

// 2. Fetch student profile details
studentRouter.get('/student-profile/:id', getStudentProfile);

// 3. Retrieve students on the waitlist
studentRouter.get('/waitlist', getWaitlist);

// 4. Approve a student on the waitlist
studentRouter.post('/waitlist/:id/approve', approveWaitlistStudent);

// 5. Reject a student on the waitlist
studentRouter.post('/waitlist/:id/reject', rejectWaitlistStudent);

// 6. Send a message to a student
studentRouter.post('/students/:id/message', sendMessageToStudent);

// 7. Remove a student from the system
studentRouter.delete('/students/:id/remove', removeStudent);

