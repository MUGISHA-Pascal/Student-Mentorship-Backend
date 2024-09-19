import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const createConsultancyRequest = async (req, res) => {
    try {
        const { name, email, phone, career } = req.body;

        if (!name || !email || !phone || !career) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const consultancyRequest = await prisma.consultancyRequest.create({
            data: { name, email, phone, career },
        });

        return res.status(201).json({
            msg: 'Consultancy booked successfully',
            consultancyRequest
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

export const createEmailSubscription = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const existingSubscription = await prisma.emailSubscription.findUnique({
            where: { email },
        });

        if (existingSubscription) {
            return res.status(400).json({ error: 'Email is already subscribed' });
        }

        const emailSubscription = await prisma.emailSubscription.create({
            data: { email },
        });

        return res.status(201).json({ message: 'Email Subscription successful', emailSubscription });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};