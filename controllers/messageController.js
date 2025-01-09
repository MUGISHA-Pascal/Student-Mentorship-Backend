import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Send a message (Create)
export const createMessage = async (req, res) => {
  try {
    const { sessionId, senderId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        sessionId,
      },
    });

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get messages for a session (Retrieve)
export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await prisma.message.findMany({
      where: { sessionId },
      include: { sender: true }, // Adjust if sender details are required
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Update a message (Update)
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params; // Message ID
    const { content } = req.body;

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        ...(content && { content }),
      },
    });

    res.status(200).json({ message: 'Message updated successfully', data: updatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message', error: error.message });
  }
};

// Delete a message (Delete)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // Message ID

    await prisma.message.delete({
      where: { id },
    });

    res.status(204).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
