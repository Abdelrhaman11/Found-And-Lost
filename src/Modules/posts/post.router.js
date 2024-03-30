import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import {
//  lostPostSchema,
  postIdSchema,
  updatePostSchema,
  searchQuerySchema,
  sendReportSchema,
} from "./post.validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  addImage,
  addPost,
  allPosts,
  closeCase,
  deletePost,
  searchedPost,
  sendReport,
  singlePost,
  updatePostData,
  updatePostImages,
} from "./post.controller.js";

const router = Router();

// Add Post
router.post(
  "/newpost",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).fields([{ name: "postImages", maxCount: 8 }]),
  //isValid(lostPostSchema),
  addPost
);

// Get all Posts
router.get("/allposts",isAuthenticated,isAuthorized("user"), allPosts);

// Get single Post
router.get(
  "/allposts/:postId",
  isAuthenticated,
  isAuthorized("user"),
  isValid(postIdSchema),
  singlePost
);

// Delete post
router.delete(
  "/:postId",
  isAuthenticated,
  isAuthorized("user"),
  isValid(postIdSchema),
  deletePost
);

// update images in post
router.patch(
  "/:postId",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).fields([{ name: "postImages", maxCount: 8 }]),
  isValid(postIdSchema),
  updatePostImages
);

// update data in post
router.patch(
  "/data/:postId",
  isAuthenticated,
  isAuthorized("user"),
  isValid(updatePostSchema),
  updatePostData
);


// Search
router.get(
  "/search",
  isAuthenticated,
  isAuthorized("user"),
  isValid(searchQuerySchema),
  searchedPost
);

//send Report
router.post(
  "/sendreport/:postId",
  isAuthenticated,
  isAuthorized("user"),
  isValid(sendReportSchema),
  sendReport
);

// close case
router.patch(
  "/close/:postId",
  isAuthenticated,
  isAuthorized("user"),
  isValid(postIdSchema),
  closeCase
);

// ADD Image
router.post(
  "/addImage/:postId",
  isAuthenticated,
  isAuthorized("user"),
  fileUpload(filterObject.image).fields([{ name: "postImages", maxCount: 8 }]),
  //isValid(newImageSchema),
  addImage
)

export default router;
