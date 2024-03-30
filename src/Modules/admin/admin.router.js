import { Router } from "express";
import { allPosts, singlePost } from "../posts/post.controller.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { postIdSchema } from "../posts/post.validation.js";
import { addDarSchema, addpoliceSchema, singleReportSchema } from "./admin.validation.js";
import {
  addDar,
  addPolice,
  allReport,
  deletePost,
  singleReport,
} from "./admin.controller.js";

const router = Router();

// Get all posts
router.get("/posts", isAuthenticated, isAuthorized("admin"), allPosts);

// Get single Post
router.get(
  "/posts/:postId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(postIdSchema),
  singlePost
);

// Delete post
router.delete(
  "/:postId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(postIdSchema),
  deletePost
);

// Add Police Account
router.post(
  "/addpolice",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(addpoliceSchema),
  addPolice
);

// Add Dar account
router.post(
  "/adddar",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(addDarSchema),
  addDar
);

// get all report
router.get("/reports", isAuthenticated, isAuthorized("admin"), allReport);

// GEt single report
router.get("/reports/:reportId",isAuthenticated,isAuthorized("admin"),isValid(singleReportSchema),singleReport);
export default router;
