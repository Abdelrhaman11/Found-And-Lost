import Joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js";

// Add Post
export const lostPostSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  gender: Joi.string().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
  type: Joi.string().required(),
  hair_type: Joi.string()
    .valid("straight", "wavy", "curly", "coily")
    .required(),
  hair_color: Joi.string()
    .required()
    .valid("black", "brown", "blond", "white/gray", "red"),
  skin_color: Joi.string()
    .required()
    .valid("very fair", "fair", "medium", "olive", "brown", "black"),
  eye_color: Joi.string()
    .required()
    .valid("black", "brown", "blue", "hazel", "amber", "green", "gray"),
  notes: Joi.string(),
}).required();

// Post
export const postIdSchema = Joi.object({
  postId: Joi.string().custom(isValidObjectId).required(),
}).required();
/*export const newImageSchema = Joi.object({
  postId: Joi.string().custom(isValidObjectId).required(),
  imageId: Joi.string().custom(isValidObjectId).required(),
  postImages: Joi.array().items(
    Joi.object({
      featureVector: Joi.array().required(),
    }))
}).required();*/

// Update data Post
export const updatePostSchema = Joi.object({
  postId: Joi.string().custom(isValidObjectId).required(),
  firstName: Joi.string().min(3).max(20),
  lastName: Joi.string().min(3).max(20),
  gender: Joi.string(),
  age: Joi.number(),
  address: Joi.string(),
  type: Joi.string(),
  hair_type: Joi.string(),
  hair_color: Joi.string(),
  skin_color: Joi.string(),
  eye_color: Joi.string(),
  notes: Joi.string(),
}).required();

// Search
export const searchQuerySchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string().valid("male", "female"),
  age: Joi.number().integer().min(0),
  recentLocation: Joi.string(),
  type: Joi.string().valid("Lost", "Found"),
  hair_type: Joi.string().valid("straight", "wavy", "curly", "coily"),
  hair_color: Joi.string().valid(
    "black",
    "brown",
    "blond",
    "white/gray",
    "red"
  ),
  skin_color: Joi.string().valid(
    "very fair",
    "fair",
    "medium",
    "olive",
    "brown",
    "black"
  ),
  eye_color: Joi.string().valid(
    "black",
    "brown",
    "blue",
    "hazel",
    "amber",
    "green",
    "gray"
  ),
}).required();

// Send report
export const sendReportSchema = Joi.object({
  postId: Joi.string().custom(isValidObjectId).required(),
  reason: Joi.string().required(),
  description: Joi.string(),
}).required();
