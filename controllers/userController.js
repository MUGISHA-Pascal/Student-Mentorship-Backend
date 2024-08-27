import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const { userId, userRole } = req;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: userRole,
      },
    });
    return res.status(200).json({ message: "user retrieved successfully", user })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });

  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res
      .status(200)
      .json({
        message: "users retrieved successfully",
        users
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });
    return res
      .status(200)
      .json({
        message: "user deleted successfully"
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}