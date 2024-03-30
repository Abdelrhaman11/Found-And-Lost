import Joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js";

// Add police account
export const addpoliceSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  location: Joi.string(),
}).required();

// Add DAR account
export const addDarSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  name: Joi.string().required(),
}).required();

// Single report
export const singleReportSchema = Joi.object({
  reportId: Joi.string().custom(isValidObjectId).required(),
}).required();
