import { PrismaClient, ROLE } from "@prisma/client";
import bcrypt from "bcryptjs";
import { userSchema } from "../schemas/sign-up.js";
import { generateToken } from "../middleware/auth.js";
import { loginSchema } from "../schemas/login-schema.js";
import sendEmail from "../utils/sendEmail.js";
import emailTemplate from "../utils/emailTemplate.js";
const prisma = new PrismaClient();

// Function to create a new user
export const RegisterUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { firstName, lastName, email, dob, gender, password, role } =
    value;

  try {
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

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        dob,
        gender,
        password: hashedPassword,
        role : ROLE[role.toUpperCase()],
      },
    });

    const subject = 'Welcome to GOYA!';
    const htmlContent = emailTemplate();

    await sendEmail(
      email,
      subject,
      null,
      htmlContent
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);

    res
      .status(200)
      .json({
        message: "Login successful",
        user,
        token
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
