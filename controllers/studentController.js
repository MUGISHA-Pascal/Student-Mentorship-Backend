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
  