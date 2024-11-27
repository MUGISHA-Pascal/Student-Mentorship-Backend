import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a session
export const createSession = async (req, res) => {
  try {
    const { title, startTime, endTime, participantIds } = req.body;

    const session = await prisma.session.create({
      data: {
        ...(title && { title }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(participantIds && {
          participants: {
            create: participantIds.map((id) => ({ userId: id })),
          },
        }),
      },
    });

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Retrieve all sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        participants: true, // Adjust as needed for relational data
      },
    });

    res.status(200).json({ message: 'Sessions retrieved successfully', sessions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// Update a session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, status } = req.body;

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(status && { status }),
      },
    });

    res.status(200).json({ message: 'Session updated successfully', updatedSession });
  } catch (error) {
    res.status(500).json({ message: 'Error updating session', error: error.message });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id },
    });

    res.status(204).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session', error: error.message });
  }
};
