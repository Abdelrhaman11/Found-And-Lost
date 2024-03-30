import { darModel } from "../../../DB/models/dar.model.js";
import { policeModel } from "../../../DB/models/police.model.js";
import { postModel } from "../../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../../utils/cloud.js";
import { reportModel } from "../../../DB/models/report.model.js";

// Delete post
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);
  if (!post) return next(new Error("Post not found !"));

  const imagesArr = post.images;
  const ids = imagesArr.map((imageObj) => imageObj.id);

  //delete images
  const result = await cloudinary.api.delete_resources(ids);

  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/posts/${post.cloudFolder}`
  );

  // Delete post from DB
  await postModel.findByIdAndDelete(req.params.postId);

  //send response
  return res.json({ success: true, message: "post deleted successfully" });
});

// ADD Police Account
export const addPolice = asyncHandler(async (req, res, next) => {
  const { email, password, location } = req.body;

  const isUser = await policeModel.findOne({ email });
  if (isUser)
    return next(new Error("Email already registerd !", { cause: 409 }));

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const user = await policeModel.create({
    email,
    password: hashPassword,
    location,
  });

  return res.json({
    success: true,
    message: "Police user saved successfully ",
    results: user,
  });
});

// ADD Dar Account
export const addDar = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  const isUser = await darModel.findOne({ email });
  if (isUser)
    return next(new Error("Email already reqistered !"), { cause: 409 });

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const user = await darModel.create({
    email,
    password: hashPassword,
    name,
  });
  return res.json({
    success: true,
    message: "Dar user saved successfully ",
    results: user,
  });
});

// All reports
export const allReport = asyncHandler(async (req, res, next) => {
  const getReports = await reportModel.find();
  return res.json({ success: true, Reports: getReports });
});

// Single reports
export const singleReport = asyncHandler(async (req, res, next) => {
  const { reportId } = req.params;
  const report = await reportModel.findById(reportId);
  if (!report) return next(new Error("Report not found !"));

  res.json({ success: true, results: report });
});
