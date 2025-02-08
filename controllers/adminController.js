import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import dotenv from 'dotenv';
const prisma = new PrismaClient();
export const getAllMentors = async (req, res) => {
  try {
    const coaches = await prisma.coach.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            approved: true,
          },
        },
        career: { // Include career information
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
    res.status(200).json(coaches);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch coaches", details: error.message });
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
    }));

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students", details: error.message });
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
