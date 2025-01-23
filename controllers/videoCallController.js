import { generateStreamToken } from "../middleware/tokenProvider.js";

export const generateToken = (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const token = generateStreamToken(userId);
      res.json({ token });
    } catch (error) {
      console.error('Error generating Stream token:', error);
      res.status(500).json({ error: 'Failed to generate Stream token' });
    }
  };