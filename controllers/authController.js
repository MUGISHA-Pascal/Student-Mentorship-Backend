// Assuming this is in a file like userController.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { userSchema } from "../schemas/sign-up.js";
import { generateToken } from "../middleware/auth.js";
import { loginSchema } from "../schemas/login-schema.js";
import sendEmail from "../utils/sendEmail.js";
const prisma = new PrismaClient();

// Function to create a new user

export const RegisterUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { firstName, lastName, email, age, gender, password, role, career } =
    value;

  try {
    // Hash the password before storing it
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user)
      return res
        .status(401)
        .json({ message: "user already exist", user: null });
    const hashedPassword = await bcrypt.hash(password, 10);

    await sendEmail(
      email,
      "Welcome to GOYA!",
      "Dear Client,\n\nCongratulations! You have successfully registered with GOYA (Go Young Africans). Your journey towards greatness begins here. You are now on our waitlist, and we will notify you as soon as GOYA is ready to be used. Meanwhile, please take a moment to fill out this form to help us better understand your needs and preferences:\n\n[Google Form Link](https://docs.google.com/forms/d/1tsRHt1fscAF7xPOG2WLJA6x8pIf2-3s_fAyARSCujuY)\n\nStay tuned for exciting updates!\n\nWarm regards,\nThe GOYA Team",
      null
    );
    // Create user using Prisma
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        age,
        gender,
        password: hashedPassword,
        role,
        career,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login function

export const loginUser = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = value;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
