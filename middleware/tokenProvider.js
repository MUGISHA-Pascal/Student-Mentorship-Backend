// backend/tokenProvider.js
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

export const generateStreamToken = (userId) => {
  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
  
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  
  // Generate the token for the user
  const token = streamClient.createToken(userId, expirationTime, issuedAt);

  return token;
};
