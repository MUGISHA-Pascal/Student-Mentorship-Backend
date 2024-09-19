import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import otpTemplate from "../utils/otpTemplate.js"
import successPasswordTemplate from "../utils/successPasswordTemplate.js";

const prisma = new PrismaClient();

export const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!userExists)
      return res.status(400).json({
        message: "no user with that email exist , please create account",
        data: null,
      });
    const secret = speakeasy.generateSecret({ length: 20 });
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    // Set OTP expiration time (e.g., 30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    // await sendEmail(
    //   email,
    //   "reset password",
    //   `Dear Client, You have requested to reset your password for your GOYA (Go Young Africa) account. To complete this process, please use the following OTP (One-Time Password): OTP: ${otp}. If you did not request a password reset, please ignore this email or contact our support team immediately. Warm regards, The GOYA Team`,
    //   null
    // );
    const subject = "OTP for Password Reset";
    const htmlContent = otpTemplate(otp);
    await sendEmail(
      email,
      subject,
      null,
      htmlContent
    );
    // Save OTP details to the database
    const otpRecord = await prisma.oTP.create({
      data: {
        email,
        otp,
        secret: secret.base32,
        expiresAt,
      },
    });

    return res
      .status(201)
      .json({ message: "otp generated successfully", data: otpRecord.otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const validateAndVerifyOtp = async (req, res) => {
  try {
    const { otp } = req.query;
    console.log(otp);
    // Find OTP record in the database
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        otp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", data: null });
    }

    const verified = speakeasy.totp.verify({
      secret: otpRecord.secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });
    console.log(verified);
    if (verified) {
      await prisma.oTP.delete({
        where: { id: otpRecord.id },
      });
      return res.status(200).json({
        message: "OTP is valid, now you can reset your password",
        data: otpRecord.email,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid OTP, please enter valid OTP", data: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!userExists)
      return req.status(400).json({
        message: "no user with that email exist , please create account",
        data: null,
      });
    if (await bcrypt.compare(password, userExists.password))
      return res.status(401).json({
        message: "use password which is not your currently  password",
        data: null,
      });
    // await sendEmail(
    //   email,
    //   "Dear Client, Your password has been successfully updated for your GOYA (Go Young Africa) account. You can now use your new password to log in to your account. If you did not request this change or if you encounter any issues, please contact our support team immediately. Warm regards, The GOYA Team",
    //   null
    // );
    const subject = "Password Successfully Updated";
    const htmlContent = successPasswordTemplate();
    await sendEmail(
      email,
      subject,
      null,
      htmlContent
    );
    const newPassword = await bcrypt.hash(password, 10);
    const updatedPassword = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newPassword,
      },
    });

    return res.status(200).json({
      message: "password have been updated successfully, now you can login",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};