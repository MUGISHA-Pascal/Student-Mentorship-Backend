import { PrismaClient } from "@prisma/client";
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

// 2. Calculate coach statistics
export const getCoachStatistics = async (req, res) => {
    const { id } = req.params;
    try {
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                students: true,
                courses: true,
            },
        });

        if (!coach) return res.status(404).json({ message: 'Coach not found' });

        const studentCount = coach.students.length;
        const courseCount = coach.courses.length;

        // Aggregate ratings to find average
        const ratings = await prisma.rating.aggregate({
            _avg: { rating: true },
            where: { coachId: id },
        });

        const avgRating = ratings._avg.rating || 0;

        res.json({ studentCount, courseCount, avgRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Fetch performance metrics
export const getCoachPerformance = async (req, res) => {
    const { id } = req.params;
    try {
        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                students: true,
                courses: true,
                activities: true,
            },
        });

        if (!coach) return res.status(404).json({ message: 'Coach not found' });

        const completedActivities = coach.activities.filter(activity => activity.status === 'Done').length;
        const ongoingActivities = coach.activities.filter(activity => activity.status === 'Ongoing').length;
        const upcomingActivities = coach.activities.filter(activity => activity.status === 'Upcoming').length;

        const ratings = await prisma.rating.aggregate({
            _avg: { rating: true },
            where: { coachId: id },
        });

        const avgRating = ratings._avg.rating || 0;
        const studentCount = coach.students.length;
        const courseCount = coach.courses.length;

        res.json({
            studentCount,
            courseCount,
            avgRating,
            completedActivities,
            ongoingActivities,
            upcomingActivities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 4. Fetch all activities of a coach
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

// 5. Fetch recent activities (Upcoming and Ongoing)
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
