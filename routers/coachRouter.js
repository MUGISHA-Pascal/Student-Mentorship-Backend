import express from 'express';
import { 
    getCoachProfile, 
    getCoachStatistics, 
    getCoachPerformance, 
    getCoachActivities, 
    getRecentActivities 
} from '../controllers/coachController.js'; // Importing controller functions

export const coachRouter = express.Router(); 

// 1. Fetch coach details
coachRouter.get('/profile/:id', getCoachProfile);

// 2. Calculate coach statistics
coachRouter.get('/:id/statistics', getCoachStatistics);

// 3. Fetch performance
coachRouter.get('/performance/:id', getCoachPerformance);

// 4. Fetch activities
coachRouter.get('/:id/activity', getCoachActivities);

// 5. Fetch recent activities
coachRouter.get('/:id/recent-activities', getRecentActivities);
