import express from 'express';
import { 
    createCoach,
    deleteCoach,
    updateCoach,
    getCoachProfile, 
    getCoachStatisticsAndPerformance, 
    getCoachActivities, 
    createCoachActivity,
    updateCoachActivity,
    deleteCoachActivity,
    getRecentActivities,
    createCareer, 
    getCoachCareers,
    updateCareer,
    deleteCareer,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience ,
    getWorkExperience,
    getCoachesList
} from '../controllers/coachController.js'; // Importing controller functions

export const coachRouter = express.Router(); 

// 1. Fetch coach details
coachRouter.get('/profile/:id', getCoachProfile);
coachRouter.get('/coaches', getCoachesList); // Fetch all coaches
coachRouter.post('/coaches', createCoach); 
coachRouter.put('/coaches/:id', updateCoach);
coachRouter.delete('/coaches/:id', deleteCoach);

//2. Fetch coach statistics and performance
coachRouter.get('/:id/statistics', getCoachStatisticsAndPerformance);  

// 4. Fetch activities
coachRouter.get('/:id/activity', getCoachActivities);
coachRouter.post('/:id/activity', createCoachActivity); // Add new activity 
coachRouter.put('/:id/activity/:activityId', updateCoachActivity); // Update activity   
coachRouter.delete('/:id/activity/:activityId', deleteCoachActivity); // Delete activity

// 5. Fetch recent activities
coachRouter.get('/:id/recent-activities', getRecentActivities);
// 6. Careers and work experience routes
coachRouter.post('/:id/career', createCareer);              // Add new career
coachRouter.get('/:id/careers', getCoachCareers);           // Fetch all careers for a coach
coachRouter.put('/:id/careers/:careerId', updateCareer);     // Update career    
coachRouter.delete('/:id/careers/:careerId', deleteCareer);  // Delete career    
coachRouter.post('/:id/work-experience', addWorkExperience);  // Add work experience
coachRouter.put('/:id/work-experience/:experienceId', updateWorkExperience); // Update work experience
coachRouter.delete('/:id/work-experience/:experienceId', deleteWorkExperience); // Delete work experience
coachRouter.get('/:id/work-experience/', getWorkExperience); // Fetch work experience

