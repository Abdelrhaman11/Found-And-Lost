import { Router } from "express";
import * as authController from "./auth.controller.js";
import * as validator from "./auth.validation.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";

const router = Router();

// signUp
router.post("/signup", isValid(validator.signupSchema), authController.signup);

// Account Activation
router.get(
  "/confirmEmail/:activationCode",
  isValid(validator.activateSchema),
  authController.activateAccount
);

// User Login 
router.post("/login", isValid(validator.loginSchema), authController.login);

// Login Admin
//router.post("/admin",isAuthorized("admin"),isValid(validator.loginSchema),authController.loginAdmin)

// Forget code
router.post(
  "/sendForgetCode",
  isValid(validator.forgetCodeSchema),
  authController.sendForgetCode
);

// Reset Password
router.put(
  "/resetpassword",
  isValid(validator.resetPasswordSchema),
  authController.resetPassword
);

export default router;
