import Joi from 'joi';

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  dob: Joi.string().required(),
  gender: Joi.string().valid('male', 'female', 'other'),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'coach', 'admin', 'employer', 'family').required(),
});
