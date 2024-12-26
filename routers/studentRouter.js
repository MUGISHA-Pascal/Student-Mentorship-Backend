import express from 'express';
import {
    getStudentsList,
    getStudentProfile,
    getWaitlist,
    approveWaitlistStudent,
    rejectWaitlistStudent,
    sendMessageToStudent,
    removeStudent,
    createStudent,
    getStudentStatistics,
    getPerformanceStatistics,
    getUpcomingEvents,
    getCoachExperience,
    getCoachProfile,
    getAvailableCourses,
    getRecentActivities,
    getCoachCourses,
    getCoachRating,
    submitMentorReview,
    clearRecentActivities,
    getEventSchedule,
    getMentorCV,
    getReview,
    getCalendarView,
    removeEvent,
    addEventToSchedule,
    getDailyMeetings
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

//8.Add a new student
studentRouter.post('/students', createStudent);

// 9. Fetch student statistics
studentRouter.get('/student-statistics/:id', getStudentStatistics);

// 10. Get performance statistics for a student
studentRouter.get('/performance-statistics/:studentId', getPerformanceStatistics);

// 11. Retrieve all upcoming events for students
studentRouter.get('/upcoming-events', getUpcomingEvents);

studentRouter.get('/recent-activities', getRecentActivities);

// 12. Get available courses with documents
studentRouter.get('/available-courses', getAvailableCourses);

// 13. Get mentor (coach) profile by ID
studentRouter.get('/mentor-profile/:coachId', getCoachProfile);

// 14. Get mentor (coach) experience by ID
studentRouter.get('/mentor-experience/:mentorId', getCoachExperience);

// 15. Retrieve the courses of a coach
studentRouter.get('/mentor-courses/:coachId', getCoachCourses);

// 16. Retrieve the average rating of a coach
studentRouter.get('/mentor-rating/:coachId', getCoachRating);

// 17. Submit a review for a coach
studentRouter.post('/mentor-review/:coachId', submitMentorReview);

// 18. Retrieve reviews for a mentor (coach)
studentRouter.get('/mentor-reviews/:coachId', getReview);

// 19. Retrieve the CV of a mentor (coach)
studentRouter.get('/mentor-cv/:mentorId', getMentorCV);

// 20. Fetch event schedule for the student
studentRouter.get('/event-schedule', getEventSchedule);

// 21. Clear recent activities for the student
studentRouter.delete('/clear-recent-activities', clearRecentActivities);

// 22. Fetch daily meetings for the student
studentRouter.get('/daily-meetings', getDailyMeetings);

// 23. Add an event to the student's schedule
studentRouter.post('/add-event', addEventToSchedule);

// 24. Remove an event from the student's schedule
studentRouter.delete('/remove-event', removeEvent);

// 25. Fetch the calendar view for the student
studentRouter.get('/calendar-view', getCalendarView);