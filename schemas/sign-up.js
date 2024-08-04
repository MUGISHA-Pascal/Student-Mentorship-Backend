import Joi from 'joi';

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(12).max(120), // Example: Age must be between 12 and 120
    gender: Joi.string().valid('male', 'female', 'other'),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('STUDENT', 'COACH', 'EMPLOYER', 'ADMIN').required(),
    career: Joi.string().allow('', null), // Optional career field
  });
