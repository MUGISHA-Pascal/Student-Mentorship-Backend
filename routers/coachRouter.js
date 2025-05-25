import express from "express";
import {
  createCoach,
  deleteCoach,
  updateCoachProfile,
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
  deleteWorkExperience,
  getWorkExperience,
  getCoachesList,
  getWaitlistForCoach,
  updateStudentStatus,
  getAllStudents,
  jotFormHook,
  getCareers,
  createnNewCareer,
  deleteCareerById,
  updateNewCareer,
  getCohorts,
  updateCohort,
  addCohort,
  deleteCohort,
  getCohortsByCareerId,
  getCoursesByCareerId,
  getMentorsByCourseId,
  getMentors,
} from "../controllers/coachController.js"; // Importing controller functions
import multer from "multer";

export const coachRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// 1. Fetch coach details
coachRouter.get("/profile/:id", getCoachProfile);
coachRouter.get("/coaches", getCoachesList); // Fetch all coaches
coachRouter.post("/coaches", createCoach);
coachRouter.put(
  "/coaches/:id",
  upload.fields([{ name: "image" }, { name: "cv" }]),
  updateCoachProfile
);
coachRouter.delete("/coaches/:id", deleteCoach);

//2. Fetch coach statistics and performance
coachRouter.get("/:id/statistics", getCoachStatisticsAndPerformance);
//course
coachRouter.get("/coursesByCareerId/:careerId", getCoursesByCareerId);
coachRouter.get("/mentorsByCourseId/:courseId", getMentorsByCourseId);
coachRouter.get("/get-mentors", getMentors);
// 4. Fetch activities
coachRouter.get("/:id/activity", getCoachActivities);
coachRouter.post("/:id/activity", createCoachActivity); // Add new activity
coachRouter.put("/:id/activity/:activityId", updateCoachActivity); // Update activity
coachRouter.delete("/:id/activity/:activityId", deleteCoachActivity); // Delete activity
//get cohorts
coachRouter.get("/cohorts", getCohorts);
coachRouter.get("/cohortByCareerId/:careerId", getCohortsByCareerId);
coachRouter.put("/update-cohort/:id", updateCohort);
coachRouter.post("/add-cohort", addCohort);
coachRouter.delete("/delete-cohort/:id", deleteCohort);
// 5. Fetch recent activities
coachRouter.get("/:id/recent-activities", getRecentActivities);
// 6. Careers and work experience routes
coachRouter.post("/:id/career", createCareer); // Add new career
coachRouter.get("/:id/careers", getCoachCareers); // Fetch all careers for a coach
coachRouter.post("/create-career", createnNewCareer); // Add new career
coachRouter.get("/get-careers/", getCareers); // Fetch
coachRouter.put("/:id/careers/:careerId", updateCareer); // Update career
coachRouter.put("/update-career/:careerId", updateNewCareer); // Update career
coachRouter.delete("/:id/careers/:careerId", deleteCareer); // Delete career
coachRouter.delete("/delete-career/:careerId", deleteCareerById); // Delete career
coachRouter.post("/:id/work-experience", addWorkExperience); // Add work experience
coachRouter.put("/:id/work-experience/:experienceId", updateWorkExperience); // Update work experience
coachRouter.delete("/:id/work-experience/:experienceId", deleteWorkExperience); // Delete work experience
coachRouter.get("/:id/work-experience/", getWorkExperience); // Fetch work experience
coachRouter.get("/waitlist/:coachId", getWaitlistForCoach); // Fetch work experience
coachRouter.put("/:coachId/student/status", updateStudentStatus);
coachRouter.get("/students/:coachId", getAllStudents);
coachRouter.post("/jotform", jotFormHook);
