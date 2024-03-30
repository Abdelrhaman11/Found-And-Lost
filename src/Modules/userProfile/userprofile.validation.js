import Joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js";
const userNameRegex = /^@[^@\s]+$/;

// Update
export const updateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  nId: Joi.number(),
  Location: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.string(),
  phone: Joi.string(),
  userName:Joi.string().min(4).max(15).regex(userNameRegex)
}).required();

// change pass
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(8).max(16),
  newPassword: Joi.string().required().min(8).max(16),
  newConfirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
}).required();
