import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        student: { include: { coach: { include: { user: true } } } },
      },
    });
    return res
      .status(200)
      .json({ message: "user retrieved successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).json({
      message: "users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get any table id from userId related to

export const getEntityFromToken = async (req, res) => {
  const { table } = req.query; // Extract table name as a query parameter

  if (!table) {
    return res.status(400).json({ message: "Table name is required" });
  }

  const userId = req.userId; // Retrieved from the middleware

  try {
    let result;

    // Dynamically query the specified table
    switch (table) {
      case "coach":
        result = await prisma.coach.findUnique({
          where: { userId },
        });
        break;

      case "student":
        result = await prisma.student.findUnique({
          where: { userId },
        });
        break;

      case "admin":
        result = await prisma.admin.findUnique({
          where: { userId },
        });
        break;

      default:
        return res.status(400).json({ message: `Unsupported table: ${table}` });
    }

    if (!result) {
      return res
        .status(404)
        .json({ message: `${table} not found for this user` });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data" });
  }
};
