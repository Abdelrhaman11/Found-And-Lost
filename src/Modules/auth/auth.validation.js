import Joi from "joi";

const nameRegex = /^[a-zA-Z\s'-]+$/;
const emailRegex= /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex=  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

// sign up
export const signupSchema =Joi.object({
    name: Joi.string().min(3).max(20).regex(nameRegex).required(),
    nId:Joi.number().required(),
    email: Joi.string().email().regex(emailRegex).required(),
    password: Joi.string().min(8).max(16).regex(passwordRegex).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')).required(),
}).required()

// Active account
export const activateSchema=Joi.object({
    activationCode:Joi.string().required()
}).required()

// Login
export const loginSchema=Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).required()

// Forget code
export const forgetCodeSchema =Joi.object({
    email:Joi.string().email().required()
}).required()

// Reset pass
export const resetPasswordSchema = Joi.object({
    email:Joi.string().email().required(),
    forgetCode: Joi.string().required(),
    password:Joi.string().regex(passwordRegex).required(),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required(),
}).required()


