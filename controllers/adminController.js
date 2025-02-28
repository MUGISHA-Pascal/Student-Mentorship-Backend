import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import dotenv from 'dotenv';
const prisma = new PrismaClient();
import sendEmail from "../utils/sendEmail.js";
import approveEmail from "../utils/mentorApproveEmail.js";
import removeEmail from "../utils/mentorRemoveEmail.js";
import rejectEmail from "../utils/mentorRejectEmail.js";

export const getAllCoaches = async (req, res) => {
  try {
    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination metadata
    const totalCoaches = await prisma.coach.count();

    // Fetch paginated data
    const coaches = await prisma.coach.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        bio: true,
        image: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            dob: true,
            gender: true,
            role: true,
            filledForm: true,
            filledProfile: true,
            createdAt: true,
          },
        },
        career: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        workExperience: {
          select: {
            id: true,
            position: true,
            company: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // Send response with pagination info
    res.status(200).json({
      data: coaches,
      currentPage: page,
      totalPages: Math.ceil(totalCoaches / limit),
      totalItems: totalCoaches,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch mentors", details: error.message });
  }
};


export const getPendingCoaches = async (req, res) => {
  try {
    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination metadata
    const totalCoaches = await prisma.coach.count({
      where: { user: { approved: false } },
    });

    // Fetch paginated pending coaches
    const coaches = await prisma.coach.findMany({
      skip,
      take: limit,
      where: { user: { approved: false } },
      select: {
        id: true,
        bio: true,
        image: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            dob: true,
            gender: true,
            role: true,
            filledForm: true,
            filledProfile: true,
            createdAt: true,
          },
        },
        career: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        workExperience: {
          select: {
            id: true,
            position: true,
            company: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // Send response with pagination info
    res.status(200).json({
      data: coaches,
      currentPage: page,
      totalPages: Math.ceil(totalCoaches / limit),
      totalItems: totalCoaches,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pending mentors", details: error.message });
  }
};

export const getApprovedCoaches = async (req, res) => {
  try {
    // Get page and limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination metadata
    const totalCoaches = await prisma.coach.count({
      where: { user: { approved: true } },
    });

    // Fetch paginated approved mentors
    const coaches = await prisma.coach.findMany({
      skip,
      take: limit,
      where: { user: { approved: true } },
      select: {
        id: true,
        bio: true,
        image: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            dob: true,
            gender: true,
            role: true,
            filledForm: true,
            filledProfile: true,
            createdAt: true,
          },
        },
        career: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        workExperience: {
          select: {
            id: true,
            position: true,
            company: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // Send response with pagination info
    res.status(200).json({
      data: coaches,
      currentPage: page,
      totalPages: Math.ceil(totalCoaches / limit),
      totalItems: totalCoaches,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch approved mentors", details: error.message });
  }
};


export const approveMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { approved: true },
    });

    await sendEmail(user.email, "Your Mentor Profile Has Been Approved!", null, approveEmail(user.firstName));

    res.json({ message: "Mentor approved successfully", user: updatedUser });
  } catch (error) {
    console.error("Error approving mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { approved: false },
    });

    await sendEmail(user.email, "Your Mentor Profile Has Been Disabled", null, removeEmail(user.firstName));

    res.json({ message: "Mentor removed (set to unapproved)", user: updatedUser });
  } catch (error) {
    console.error("Error removing mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    await prisma.user.delete({ where: { id } });

    await sendEmail(user.email, "Your Mentor Application Has Been Rejected", null, rejectEmail(user.firstName));

    res.json({ message: "Mentor rejected and deleted from the system" });
  } catch (error) {
    console.error("Error rejecting mentor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCoachApproval = async (req, res) => {
  const { coachId } = req.params;
  const { approve } = req.body;

  if (typeof approve !== "boolean") {
    return res.status(400).json({ error: "Invalid approval status" });
  }

  try {
    const updatedCoach = await prisma.coach.update({
      where: { id: coachId },
      data: {
        user: {
          update: {
            approved: approve,
          },
        },
      },
    });

    res.status(200).json({
      message: `The Coach is ${approve ? "approved" : "rejected"}.`,
      coach: updatedCoach,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update coach approval", details: error.message });
  }
}

export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            gender: true,
            dob: true,
          },
        },
        enrollments: {
          select: {
            cohort: {
              select: {
                id: true,
                name: true,
                status: true,
                career: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        coaches: {
          select: {
            id: true,
            bio: true,
            image: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const formattedStudents = students.map((student) => ({
      id: student.user.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      approved: student.user.approved,
      gender: student.user.gender,
      dob: student.user.dob,
      enrollments: student.enrollments.map((enrollment) => ({
        cohortId: enrollment.cohort.id,
        cohortName: enrollment.cohort.name,
        cohortStatus: enrollment.cohort.status,
        career: enrollment.cohort.career, // Contains career id and title
      })),
      coaches: student.coaches.map((coach) => ({
        id: coach.id,
        coachName: `${coach.user.firstName} ${coach.user.lastName}`,
        coachEmail: coach.user.email,
        bio: coach.bio,
        image: coach.image,
      })),
    }));

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch students",
      details: error.message,
    });
  }
};


export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    await prisma.student.delete({
      where: {
        id: studentId,
      },
    });

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete student", details: error.message });
  }
};

// Admin statistics

export const getAdminStatistics = async (req, res) => {
  try {
    // Get total counts
    const studentCount = await prisma.student.count();
    const mentorCount = await prisma.coach.count();
    const courseCount = await prisma.course.count();
    const cohortCount = await prisma.cohort.count();

    // Count approved & waitlisted students
    const approvedStudents = await prisma.student.count({
      where: { status: "APPROVED" },
    });

    const waitlistedStudents = await prisma.student.count({
      where: { status: "WAITLIST" },
    });

    // Count approved & waitlisted mentors
    const approvedMentors = await prisma.coach.count({
      where: {
        user: {
          approved: true,
        },
      },
    });

    const waitlistedMentors = await prisma.coach.count({
      where: {
        user: {
          approved: false,
        },
      },
    });

    res.status(200).json({
      studentCount,
      mentorCount,
      courseCount,
      cohortCount,
      approvedStudents,
      waitlistedStudents,
      approvedMentors,
      waitlistedMentors,
    });
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json({
      error: "Failed to fetch admin statistics",
      details: error.message,
    });
  }
};

export const getApprovedStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalStudents = await prisma.student.count({
      where: { user: { approved: true } },
    });

    const students = await prisma.student.findMany({
      skip,
      take: limit,
      where: { user: { approved: true } },
      select: {
        id: true,
        bio: true,
        educationLevel: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            dob: true,
            gender: true,
            role: true,
            filledForm: true,
            filledProfile: true,
          },
        },
        enrollments: true,
      },
    });

    res.status(200).json({
      data: students,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalItems: totalStudents,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch approved students", details: error.message });
  }
};

export const getPendingStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalStudents = await prisma.student.count({
      where: { user: { approved: false } },
    });

    const students = await prisma.student.findMany({
      skip,
      take: limit,
      where: { user: { approved: false } },
      select: {
        id: true,
        bio: true,
        educationLevel: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
            dob: true,
            gender: true,
            role: true,
            filledForm: true,
            filledProfile: true,
          },
        },
        enrollments: true,
      },
    });

    res.status(200).json({
      data: students,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalItems: totalStudents,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch unapproved students", details: error.message });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { approved: true },
    });

    await sendEmail(user.email, "Your Student Profile Has Been Approved!", null, approveEmail(user.firstName));

    res.json({ message: "Student approved successfully", user: updatedUser });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/// Remove (Unapprove) Student
export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { approved: false },
    });

    await sendEmail(user.email, "Your Student Profile Has Been Disabled", null, removeEmail(user.firstName));

    res.json({ message: "Student removed (set to unapproved)", user: updatedUser });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject (Delete) Student
export const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Student not found" });
    }

    await prisma.user.delete({ where: { id } });

    await sendEmail(user.email, "Your Student Application Has Been Rejected", null, rejectEmail(user.firstName));

    res.json({ message: "Student rejected and deleted from the system successfully!" });
  } catch (error) {
    console.error("Error rejecting student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};