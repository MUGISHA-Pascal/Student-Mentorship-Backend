import { google } from 'googleapis';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];


import { OAuth2Client } from 'google-auth-library';


const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,process.env.GOOGLE_REDIRECT_URI);



export const scheduleSession = async (req, res) => {
    const { startTime, endTime, summary } = req.body;
    try {
        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        
        const accessToken = await oAuth2Client.getAccessToken();

        const event = {
            summary,
            start: { dateTime: startTime, timeZone: 'UTC' },
            end: { dateTime: endTime, timeZone: 'UTC' },
        };

        const response = await google.calendar('v3').events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event,
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error scheduling session' });
    }
};
