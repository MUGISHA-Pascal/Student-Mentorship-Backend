import { google } from 'googleapis';
import { prisma } from '../utils/prismaClient';

export const scheduleSession = async (req, res) => {
    const { startTime, endTime, summary } = req.body;
    try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: 'YOUR_ACCESS_TOKEN' });

        const event = {
            summary,
            start: { dateTime: startTime, timeZone: 'UTC' },
            end: { dateTime: endTime, timeZone: 'UTC' },
        };

        const response = await google.calendar('v3').events.insert({
            auth,
            calendarId: 'primary',
            resource: event,
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error scheduling session' });
    }
};
