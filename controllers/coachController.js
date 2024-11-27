import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'; // For handling week-based calculations
const prisma = new PrismaClient();

// 1. Fetch coach profile
export const getCoachProfile = async (req, res) => {
    const { id } = req.params;  // Fix destructuring
    try {
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                courses: true,
                students: true,
                activities: true,
            },
        });
        if (!coach) return res.status(404).json({ message: 'Coach not found' });
        res.json(coach);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


//2 Fetch and calculate statistics and performance
export const getCoachStatisticsAndPerformance = async (req, res) => {
    const { id } = req.params;
    try {
        // Retrieve coach details, making sure to pull in related data like students, courses, activities, and ratings
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                students: true,
                courses: true,
                activities: true,
                ratings: {
                    include: {
                        student: true, // Fetch the student details for each rating
                    },
                },
            },
        });

        if (!coach) return res.status(404).json({ message: 'Coach not found' });

        // Count activities based on their status: completed, ongoing, and upcoming
        const completedActivities = coach.activities?.filter(activity => activity.status === 'Done').length || 0;
        const ongoingActivities = coach.activities?.filter(activity => activity.status === 'Ongoing').length || 0;
        const upcomingActivities = coach.activities?.filter(activity => activity.status === 'Upcoming').length || 0;

        // Calculate the average rating given to the coach
        const ratings = coach.ratings || [];
        const avgRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / (ratings.length || 1);

        // Format ratings to include student names alongside their individual ratings
        const detailedRatings = ratings.map(rating => ({
            studentName: rating.student.name,
            rating: rating.rating,
        }));

        // Count the number of students under the coach
        const studentCount = coach.students?.length || 0;

        // Count the number of courses offered by the coach
        const courseCount = coach.courses?.length || 0;

        // Set date range to capture activity count for this week
        const startOfThisWeek = startOfWeek(new Date());
        const endOfThisWeek = endOfWeek(new Date());
        
        // Count activities for this week
        const weeklyActivities = await prisma.activity.count({
            where: {
                coachId: id,
                createdAt: {
                    gte: startOfThisWeek,
                    lte: endOfThisWeek,
                },
            },
        });

        // Get activity count for the previous week
        const previousWeekStart = startOfWeek(subWeeks(new Date(), 1));
        const previousWeekEnd = endOfWeek(subWeeks(new Date(), 1));

        const lastWeekActivities = await prisma.activity.count({
            where: {
                coachId: id,
                createdAt: {
                    gte: previousWeekStart,
                    lte: previousWeekEnd,
                },
            },
        });

        // Prepare data in a way that supports charting the weekly activity trends
        const weeklyStats = [
            { week: 'This Week', count: weeklyActivities },
            { week: 'Last Week', count: lastWeekActivities },
        ];

        // Send back all compiled statistics and performance metrics
        res.json({
            studentCount,
            courseCount,
            avgRating,
            completedActivities,
            ongoingActivities,
            upcomingActivities,
            weeklyStats,
            ratings: detailedRatings, // Detailed ratings with student names
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// 3. Fetch all activities of a coach
export const getCoachActivities = async (req, res) => {
    const { id } = req.params;
    try {
        const activities = await prisma.activity.findMany({
            where: { coachId: id },
        });
        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// 4. Create a new activity for a coach
export const createCoachActivity = async (req, res) => {
  const { id } = req.params; // Extract the coachId from the URL
  const { name, date, status, image } = req.body; // Extract data for activity from the request body

  console.log('Coach ID:', id); // Log to check the extracted coachId
  console.log('Activity Data:', req.body); // Log to check if the activity data is being passed

  // Check if coachId and activity data are provided
  if (!id) {
    return res.status(400).json({ message: 'Coach ID is required' });
  }

  if (!name || !date || !status) {
    return res.status(400).json({ message: 'Activity name, date, and status are required' });
  }

  try {
    // Check if the coach with the provided ID exists
    const coach = await prisma.coach.findUnique({
      where: { id: id }, // Find the coach by the provided ID
    });

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Create the activity and associate it with the coach
    const activity = await prisma.activity.create({
      data: {
        name,
        date,
        status,
        image, // Image is optional, so no validation required
        coach: {
          connect: { id: id }, // Connect the activity to the coach using the coachId
        },
      },
    });

    // Respond with the created activity
    return res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error); // Log the error
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// 5. Update a coach activity
export const updateCoachActivity = async (req, res) => {
    const { activityId } = req.params; // Get activityId from the URL params
    const { name, date, status, image } = req.body; // Get new activity data from the request body
    try {
        const updatedActivity = await prisma.activity.update({
            where: { id: activityId }, // Identify activity by its ID
            data: {
                name,
                date,
                status,
                image,
            },
        });
        res.json(updatedActivity); // Return the updated activity
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating activity' });
    }
};

// 6. Delete a coach activity
export const deleteCoachActivity = async (req, res) => {
    const { activityId } = req.params; // Get activityId from the URL params
    try {
        await prisma.activity.delete({
            where: { id: activityId }, // Delete the activity by its ID
        });
        res.json({ message: 'Activity deleted successfully' }); // Return success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting activity' });
    }
};



// 7. Fetch recent activities (Upcoming and Ongoing)
export const getRecentActivities = async (req, res) => {
    const { id } = req.params;
    try {
        const activities = await prisma.activity.findMany({
            where: { coachId: id },
            orderBy: { date: 'asc' },  // Ascending order by date
            take: 10, // Limit to 10 activities
        });

        const filteredActivities = activities.filter(
            activity => activity.status === 'Upcoming' || activity.status === 'Ongoing'
        );

        res.json(filteredActivities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//8. creating a new career
export const createCareer = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const career = await prisma.career.create({
            data: {
                title,
                description,
                coaches: {
                    connect: { id },
                },
            },
        });
        res.json(career);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating career' });
    }
};
//9. Fetch all careers for a coach
export const getCoachCareers = async (req, res) => {
    const { id } = req.params;
    try {
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: { career: true },
        });
        if (!coach) return res.status(404).json({ message: 'Coach not found' });
        res.json(coach.career);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching careers' });
    }
};
// 10. Update a career for a coach
export const updateCareer = async (req, res) => {
    const { id, careerId } = req.params;  // id is the coach ID, careerId is the career to update
    const { title, description } = req.body;  // New career data

    try {
        const career = await prisma.career.update({
            where: { id: careerId },
            data: {
                title,
                description,
                coaches: {
                    connect: { id }  // Optionally re-associate the coach (if needed)
                }
            }
        });

        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }

        res.json(career);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating career' });
    }
};
// 11. Delete a career for a coach
export const deleteCareer = async (req, res) => {
    const { id, careerId } = req.params;  // id is the coach ID, careerId is the career to delete

    try {
        // First, you could check if the coach exists
        const coach = await prisma.coach.findUnique({
            where: { id },
        });

        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        // Then, delete the career
        const career = await prisma.career.delete({
            where: { id: careerId }
        });

        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }

        res.json({ message: 'Career deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting career' });
    }
};

//12. Fetch work experience for a specific coach
export const getWorkExperience = async (req, res) => {
    const { id } = req.params;  // Get the coach ID from route params
    try {
        // Retrieve all work experiences for the coach
        const workExperience = await prisma.workExperience.findMany({
            where: { coachId: id },
            orderBy: { startDate: 'asc' },  // Optional: Order by start date, adjust as needed
        });

        // If no work experience found, return a message
        if (workExperience.length === 0) {
            return res.status(404).json({ message: 'No work experience found for this coach' });
        }

        // Respond with the work experience data
        res.json(workExperience);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//13. Add work experience
export const addWorkExperience = async (req, res) => {
    const { id } = req.params;
    const { position, company, startDate, endDate } = req.body;
    try {
        const workExperience = await prisma.workExperience.create({
            data: {
                position,
                company,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                coachId: id,
            },
        });
        res.json(workExperience);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding work experience' });
    }
};
//14. Update work experience
export const updateWorkExperience = async (req, res) => {
    const { id, experienceId } = req.params;
    const { position, company, startDate, endDate } = req.body;
    try {
        const workExperience = await prisma.workExperience.update({
            where: { id: experienceId },
            data: {
                position,
                company,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        res.json(workExperience);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating work experience' });
    }
};
//15. Delete work experience
export const deleteWorkExperience = async (req, res) => {
    const { experienceId } = req.params;
    try {
        await prisma.workExperience.delete({
            where: { id: experienceId },
        });
        res.json({ message: 'Work experience deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting work experience' });
    }
};
//16. Fetch all coaches
export const getCoachesList = async (req, res) => {
    const { firstName, lastName, course } = req.query; // Extracting query parameters for filtering

    try {
        const coaches = await prisma.coach.findMany({
            where: {
                ...(firstName ? { firstName: { contains: firstName } } : {}), // Filter by first name if provided
                ...(lastName ? { lastName: { contains: lastName } } : {}), // Filter by last name if provided
                courses: course ? { some: { name: { contains: course } } } : undefined // Filter by course if provided
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                bio: true,
                ratings: {
                    select: {
                      rating: true // Access the rating field from the Rating model
                    }
                },
                courses: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true,
                image: true, 
                students: true,
                activities: true,
                documents: true,
                career: true,
                workExperience: true,
                _count: true
            },
            orderBy: {
                firstName: 'asc'  
            }
        });

        return res.json(coaches);
    } catch (error) {
        console.error('Error fetching coaches:', error);
        return res.status(500).json({ error: 'An error occurred while fetching coaches.' });
    }
};
// 17. Create a new coach
export const createCoach = async (req, res) => {
    const { firstName, lastName, email, bio, image } = req.body; // Extract data from request body

    try {
        // Create the new coach record in the database
        const newCoach = await prisma.coach.create({
            data: {
                firstName,
                lastName,
                email,
                bio,
                image, // You can store an image URL or base64 image string, depending on your setup
            },
        });

        // Return the newly created coach
        res.status(201).json(newCoach);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating coach' });
    }
};
// 18. Update coach details
export const updateCoach = async (req, res) => {
    const { id } = req.params;  // Get the coach ID from the route parameters
    const { firstName, lastName, email, bio, image } = req.body;  // Get the updated details from the request body

    try {
        // Update the coach in the database
        const updatedCoach = await prisma.coach.update({
            where: { id },
            data: {
                ...(firstName && { firstName }),  // Update first name if provided
                ...(lastName && { lastName }),    // Update last name if provided
                ...(email && { email }),          // Update email if provided
                ...(bio && { bio }),              // Update bio if provided
                ...(image && { image }),          // Update image if provided
            },
        });

        // Respond with the updated coach
        res.json(updatedCoach);
    } catch (error) {
        console.error(error);
        // Handle cases where the coach is not found
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Coach not found' });
        } else {
            res.status(500).json({ message: 'Error updating coach' });
        }
    }
};
// 19. Delete a coach
export const deleteCoach = async (req, res) => {
    const { id } = req.params;  // Get the coach ID from the route parameters

    try {
        // Delete the coach in the database
        await prisma.coach.delete({
            where: { id },
        });

        // Respond with a success message
        res.json({ message: 'Coach deleted successfully' });
    } catch (error) {
        console.error(error);
        // Handle cases where the coach is not found
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Coach not found' });
        } else {
            res.status(500).json({ message: 'Error deleting coach' });
        }
    }
};
