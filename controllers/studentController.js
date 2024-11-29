import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 1. Retrieve a list of students (allow filtering and sorting by course)
export const getStudentsList = async (req, res) => {
    const { name, course } = req.query; // Extract query parameters for filtering

    try {
        const students = await prisma.student.findMany({
            where: {
                status: 'APPROVED', // Only fetch approved students
                user: { 
                    firstName: name ? { contains: name, mode: 'insensitive' } : undefined, // Filter by first name if provided
                    lastName: name ? { contains: name, mode: 'insensitive' } : undefined // Filter by last name if provided
                },
                courses: course ? { some: { name: { contains: course, mode: 'insensitive' } } } : undefined // Filter by course if provided
            },
            select: {
                id: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true // You can include other user fields here
                    }
                },
                status: true,
                courses: {
                    select: {
                        name: true // Select the course name(s)
                    }
                }
            },
            orderBy: {
                user: {
                    firstName: 'asc' // Sort by first name
                }
            }
        });

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 2. Fetch student profile details
export const getStudentProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.findUnique({
            where: { id }, // Find student by ID
            include: {
                courses: true,  // Include enrolled courses
                coaches: true,  // Include assigned coaches
            }
        });

        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 3. Retrieve students on the waitlist
export const getWaitlist = async (req, res) => {
    try {
        const waitlistedStudents = await prisma.student.findMany({
            where: { status: 'WAITLIST' },  // Fetch students with WAITLIST status
            select: {
                id: true,
                courses: {
                    select: {
                        name: true
                    }
                },
                status: true
            }
        });

        res.json(waitlistedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 4. Approve a student on the waitlist
export const approveWaitlistStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.update({
            where: { id },
            data: { status: 'APPROVED' },  // Update status to 'APPROVED'
        });

        res.json({ message: 'Student approved successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 5. Reject a student on the waitlist
export const rejectWaitlistStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.update({
            where: { id },
            data: { status: 'REJECTED' },  // Update status to 'REJECTED'
        });

        res.json({ message: 'Student rejected successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 6. Send a message to a student
export const sendMessageToStudent = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    try {
        const student = await prisma.student.findUnique({
            where: { id }
        });

        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Assuming there's a 'messages' table to store messages
        const newMessage = await prisma.message.create({
            data: {
                studentId: id,
                content: message
            }
        });

        res.json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 7. Remove a student from the system
export const removeStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete messages associated with the student first
        await prisma.message.deleteMany({
            where: { studentId: id }
        });

        // Then delete the student
        const deletedStudent = await prisma.student.delete({
            where: { id }
        });

        res.json({ message: 'Student removed successfully', deletedStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 8. Create a new student
export const createStudent = async (req, res) => {
    const { name, courses, coaches, status } = req.body;
  
    // Validate the input
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
  
    // Check if courses and coaches are arrays or set them to empty arrays if not
    const courseConnections = Array.isArray(courses) ? 
      courses.map(courseId => ({ id: courseId })) : [];
    const coachConnections = Array.isArray(coaches) ? 
      coaches.map(coachId => ({ id: coachId })) : [];
  
    try {
      const newStudent = await prisma.student.create({
        data: {
          name,
          status: status || 'WAITLIST', // Default to WAITLIST if no status is provided
          courses: {
            connect: courseConnections
          },
          coaches: {
            connect: coachConnections
          }
        }
      });
  
      // Return the created student without timestamps
      const { createdAt, updatedAt, ...studentWithoutTimestamps } = newStudent;
      res.status(201).json(studentWithoutTimestamps);
    } catch (error) {
      console.error("Error creating student:", error, { name, courses, coaches, status });
      
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Invalid course or coach ID' });
      }
      
      // Handle other potential Prisma errors or unknown errors
      res.status(500).json({ message: 'Failed to create student', error: error.message });
    }
  };



//* My contribution starts here Muhammad Hasim */
            
            
            /********* Student Home API *************
            *                                       *
            *                                       *
            *                                       *
            *****************************************/
            
            /** What follows until indicated other wise serves as he service for the
                Student Home API
            */
export const getStudentStatistics = async (req, res) => {
  const { id } = req.params;
  try {
    const studentStatistics = await prisma.student.findUnique({
      where: { id: id },
      include: {
        courses: true,
        coaches: {
          select: {
            name: true,
            rating: true,
            activities: true,
          },
        },
      },
    });

    if (!studentStatistics) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Count total courses the student is enrolled in
    const totalCourses = studentStatistics.courses.length;

    // Fetch mentor rating (average if multiple mentors)
    const mentorRating = studentStatistics.coaches.map(coach => coach.rating);
    const averageMentorRating = mentorRating.length ? mentorRating.reduce((sum, rating) => sum + rating, 0) / mentorRating.length : null;

    // Fetch medals or relevant achievements from activities
    const activities = studentStatistics.coaches.flatMap(coach => coach.activities);

    // Filter activities with achieved status
    const medals = activities.filter(activity => activity.status === "DONE");

    res.json({
      totalCourses,
      mentorRating: averageMentorRating,
      activities: activities.length,
      medals: medals.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student statistics' });
  }
};


export const getPerformanceStatistics = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Fetch student's performance data: courses, coaches, and activities
    const performanceData = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        courses: {
          include: {
            documents: true, // Include any documents related to the courses
          }
        },
        coaches: {
          include: {
            activities: {
              where: {
                date: {
                  gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
              select: {
                name: true,
                date: true,
                status: true,
                image: true,
              },
            },
          }
        }
      }
    });

    res.json({
      status: 'success',
      data: performanceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve performance data.',
    });
  }
};


export const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch all upcoming student events (e.g., meetings, activities, etc.)
    const upcomingEvents = await prisma.activity.findMany({
      where: {
        date: {
          gte: currentDate, // Only get events that are upcoming
        },
        status: 'UPCOMING',
      },
      include: {
        coach: true, // Include coach details if available
      },
      orderBy: {
        date: 'asc', // Order by date in ascending order
      },
    });

    res.json({
      status: 'success',
      data: upcomingEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve upcoming events.',
    });
  }
};


export const getRecentActivities = async (req, res) => {
  try {
    // Fetch recent activities with images from the past week (or another time frame)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentActivities = await prisma.activity.findMany({
      where: {
        date: {
          gte: oneWeekAgo, // Fetch activities from the past week
        },
        image: {
          not: null, // Only include activities that have an associated image
        },
      },
      include: {
        coach: true, // Optionally include coach details
      },
      orderBy: {
        date: 'desc', // Order by most recent activities first
      },
    });

    res.json({
      status: 'success',
      data: recentActivities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve recent activities.',
    });
  }
};


export const getAvailableCourses = async (req, res) => {
  try {
    // Fetch all available documents related to courses
    const availableCourses = await prisma.document.findMany({
      include: {
        coach: true,  // Optionally include details of the coach
        course: true, // Optionally include course details
      },
      orderBy: {
        uploadDate: 'desc', // Show most recently uploaded documents first
      },
    });

    res.json({
      status: 'success',
      data: availableCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve available course documents.',
    });
  }
};
/** End of Student Home API */

            
            /********* Student Mentor API *************
            *                                       *
            *                                       *
            *                                       *
            *****************************************/
            /* Everything from here until indicated is the service for the
                Student Mentor(Coach) API
            */

export const getCoachProfile = async (req, res) => {
  //  /mentor-profile/:mentorId --> EndPoint
  const { coachId } = req.params
  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'Coach ID required' });
  }
  try {
    const coachProfile = await prisma.coach.findUnique({
      where: { id: coachId },
      select: {
        name: true,
        image: true, // This assumes there is a default image in a situation where mentor does not provide an image
        rating: true,
      }
    });
    if (!coachProfile) {
      return res.status(404).json({ status: 'error', message: 'Mentor not found' });
    }
    res.json({ status: 'success', data: coachProfile });
  } catch (error) {
    console.error('Error fetching coach profile', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error.'});
  }
}
  

export const getCoachExperience = async (req, res) => { 
  /* The Exp in this case stands for --> Experience */
  //   /mentor-experience/:mentorId --> EndPoint
  const { mentorId } = req.params;
  if (!mentorId) {
    return res.status(400).json({ status: 'error', message: 'Mentor ID required' });
  }
  try {
    const experience = prisma.workExperience.findMany({
      where: { mentorId: coachId },
      orderBy: { startDate: 'asc' }
    });
    res.json({ message: 'success', data: experience });
  } catch (error) { 
    res.status(500).json({ error: error.message });
  }
}


export const getCoachCourses = async (req, res) => { 
  // /mentor-courses/:mentorId --> EndPoint
  const { coachId } = req.params;
  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'Coach ID required' });
  }
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
      select: { courses: true },
    });
    if (!coach) { 
      return res.status(404).json({ status: 'error', message: 'Coach not found' }); 
    }
    const courseCount = coach.courses.length;
    res.json({ status: 'success', data: courseCount });
  } catch (error) { 
    console.error('Error while geting coach courses', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}


export const getCoachRating = async (req, res) => {
  // /mentor-rating/:mentorId ==> EndPoint
  const { coachId } = req.params
  if (!mentorId) {
    return res.status(400).json({ status: 'error', message: 'Coach ID required' });
  }
  try {
    const ratings = await prisma.rating.findMany({
      where: { coachId: coachId },
    });
    const averageRating = ratings.reduce((sum, rating) => sum + + rating.rating, 0) / (ratings.length || 1);
    res.json({ data: averageRating });
  } catch(error) { 
    console.error('Error while retrieving the ratings', error);
    res.status(500).json({ error: error.message });
  }
}


export const submitMentorReview = async (req, res) => { 
  // POST:  /mentor-review/:mentorId ==> EndPoint
  const { studentId, rating } = req.body;
  const { coachId } = req.params;
  if (!coachId) { 
    return res.status(400).json({ status: 'error', message: 'Coach ID required' });
  }
  try {
    const rating = prisma.rating.create({
      data: {
        coachId: coachId,
        studentId,
        rating,
      }
    });
    res.status({ message: 'success', data: rating });
  } catch (error) { 
    console.log('Error, occured when rating a mentor or coach', error);
    res.status(500).json({ error: error.message });
  }
}


export const getReview = async (req, res) => {
  // GET: /mentor-reviews/:mentorId
  const { coachId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'Coach ID required' });
  }
  try {
    const coachReview = prisma.review.findMany({
      where: { coachId: coachId },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        student: {
          include: {
            user: true,
          }
        }
      }
    });
    res.json(coachReview.map((review)({
      rating: review.rating,
      studentName: `${review.student.user.firstName} ${review.student.user.lastName}`
    })));
  } catch (error) { 
    console.error('Error while fetching review', error);
    res.status(500).json({ error: error.message });
  }
}

export const getMentorCV = async (req, res) => { 
  const { mentorId } = req.params
  if (!mentorId) { 
    return res.status(400).json({status: 'error', message: 'Error Coach Id Required'})
  }
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: mentorId },
      include: {
        documents: { select: { fileUrl: true, fileName: true } }
      }
    });
    
    if (!coach || !coach.documents || coach.documents.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Coach CV not found' });
    }
    const { fileUrl, fileName } = coach.documents[0];
    res.download(fileUrl, fileName, (err) => {
      if (err) {
        res.status(500).json({ status: 'error', message: 'Error downloading file' });
      }
    });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}
/* End of Student Mentor (Coach) API */
            
            /********* Student Calender API *************
            *                                       *
            *                                       *
            *                                       *
            *****************************************/
            /* Everything from here until indicated is the service for the
                Student Calender API
            */

app.get('/event-schedule', async (req, res) => {
  const userId = req.user.id; // Assumtion of authentication is made
  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    const events = await prisma.event.findMany({
      where: { userId },
      select: { title: true, date: true, time: true, status: true },
      orderBy: { date: 'asc' },
    });
    res.json({ status: 'success', data: events });
  }catch (error) {
    console.error('Error when fetching event shedule', error);
    res.status(500).json({ error: error.message });
}
});

app.get('/recent-activities', async (req, res) => {
  const userId = req.user.id;
  if (!userId) { 
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    const activities = await prisma.recentActivities.findMany({
      where: { userId },
      select: { activity: true, timestamp: true },
      orderBy: { timestamp: 'desc' },
    });
    res.json({ message: 'Success', data: activities });
  } catch (error) { 
    console.error('Error while fetching recent activities', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/clear-recent-activities', async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    await prisma.recentActivities.deleteMany({ where: { userId } });
    res.json({ message: 'Success, activities cleared' });
  } catch (error) {
    console.error('Error, when clearing recent activities', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/daily-meetings', async (req, res) => {
  const userId = req.user.id;
  if (!userId) { 
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    const today = new Data();
    const meetings = await prisma.meeting.findMany({
      where: {
        userId,
        data: { equals: today.toISOString().split('T')[0] },
      },
      select: { subject: true, time: true, status: true },
    });
    res.json({ message: 'Success', data: meetings });
  } catch (error) { 
    console.error('Error when getting daily metting', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/add-event-to-schedule', async (req, res) => {
  const { title, date, time, userId, status } = req.body;
  try {
    const event = await prisma.event.create({
      data: { title, date, time, userId, status },
    });
    res.json({ message: 'Success', data: event });
  } catch (error) {
    console.error('Error while adding an event', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/remove-event', async (req, res) => {
  const { eventId } = req.body;
  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    await prisma.event.delete({
      where: { id: eventId },
    });
    res.json({ message: 'Event removed successfully' });
  } catch (error) { 
    console.error('Error during delete of event', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/calender-view', async (req, res) => {
  const userId = req.user.id;
  if (!userId) { 
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }
  try {
    const events = await prisma.event.findMany({
      where: { userId },
      select: { id: true, title: true, date: true, time: true, status: true },
      orderBy: { date: 'asc' },
    });
    res.json({ message: 'success', data: events });
  } catch (error) { 
    console.error('Error fetching calender view', error);
    res.status(500).json({ error: error.message });
  }
});

/* End of Student Calender API */


/*My contribution ends here Muhammad Hasim */