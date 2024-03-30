import { Types } from "mongoose";
export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.error("Invalid objectid !");
};

export const isValid = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      return res.json({
        message: "Validation Error",
        validationError: validationResult.error.details,
      });
    }
    return next();
  };
};
