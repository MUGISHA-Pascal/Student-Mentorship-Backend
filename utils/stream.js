import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_SECRET_KEY = process.env.STREAM_SECRET_KEY;

export const tokenProvider = (userId) => {
  if (!userId) throw new Error('User is not authenticated');
  if (!STREAM_API_KEY) throw new Error('Stream API key is missing');
  if (!STREAM_SECRET_KEY) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);
  const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  return streamClient.createToken(userId, expirationTime, issuedAt);
};
