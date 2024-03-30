import { Router } from "express";
import * as authController from "./userprofile.controller.js";
import * as validator from "./userprofile.validation.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

// Update Profile
router.patch(
  "/update",
  isAuthenticated,
  isAuthorized("user"),
  isValid(validator.updateSchema),
  authController.updateProfile
);

// update Profile Image
router.patch(
  "/updateProfileImage",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).single("imageProfile"),
  authController.updateProfileImage
);

// update Cover Profile
router.patch(
  "/updateCoverProfile",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).single("coverProfile"),
  authController.updateCoverProfile
);

// change Password
router.patch(
  "/changePassword",
  isAuthenticated,
  isAuthorized("user"),
  isValid(validator.changePasswordSchema),
  authController.changePassword
);

// View Profile
router.get("/profile",isAuthenticated,isAuthorized("user"),authController.viewProfile)


// all post for each user
router.get("/viewPostsForUser",isAuthenticated,isAuthorized("user"),authController.viewPostsForUser )
export default router;
