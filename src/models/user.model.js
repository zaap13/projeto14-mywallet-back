import joi from "joi";

export const userSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string().required().min(3).max(100),
  password: joi.string().required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
})