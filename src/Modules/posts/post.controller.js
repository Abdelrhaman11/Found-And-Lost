import { asyncHandler } from "../../utils/errorHandling.js";
import { nanoid } from "nanoid";
import { postModel } from "./../../../DB/models/post.model.js";
import cloudinary from "../../utils/cloud.js";
import { reportModel } from "../../../DB/models/report.model.js";
// import { findMatchingImages, findMatchingPosts } from "../../utils/match.js";
import { imageModel } from "../../../DB/models/image.mode.js";

export const addPost = asyncHandler(async (req, res, next) => {
  //file
  if (!req.files)
    return next(new Error("Person images are required !", { cause: 400 }));
  //create unique folder name
  const cloudFolder = nanoid();
  let i = 0;
  let images = [];

  // upload Post images
  for (const file of req.files.postImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/posts/${cloudFolder}` }
    );
    images.push({
      id: public_id,
      url: secure_url,
    });
  }
  // create post
  let post = await postModel.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
  });
  const image = await imageModel.create({ images, postId: post._id });

  // add imagePost in postModel
  post = await postModel.findByIdAndUpdate(
    post._id,
    { imageId: image._id },
    { new: true }
  );
  return res.status(201).json({
    results: post,
    success: true,
    message: "Post published successfully !",
    image,
  });
});

// get all Posts
export const allPosts = asyncHandler(async (req, res, next) => {
  const allPosts = await postModel.find();
  return res.json({ success: true, results: allPosts });
});

// Get single post
export const singlePost = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);
  return res.json({ success: true, results: post });
});

// Delete post
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);
  if (!post) return next(new Error("Post not found !"));

  // check owner
  if (req.user._id.toString() != post.createdBy.toString())
    return next(new Error("Not authorized !", { cause: 401 }));

  const imagesArr = post.images;
  const ids = imagesArr.map((imageObj) => imageObj.id);

  // ids.push(post.postImages.id);////////////////////////////

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

// Update Data post
export const updatePostData = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);

  if (!post) return next(new Error("Post not found!"));

  // Check owner
  if (req.user._id.toString() !== post.createdBy.toString()) {
    return next(new Error("Not authorized!", { cause: 401 }));
  }

  // Update post data
  post.firstName = req.body.firstName ? req.body.firstName : post.firstName;
  post.lastName = req.body.lastName ? req.body.lastName : post.lastName;
  post.gender = req.body.gender ? req.body.gender : post.gender;
  post.age = req.body.age ? req.body.age : post.age;
  post.recentLocation = req.body.recentLocation
    ? req.body.recentLocation
    : post.recentLocation;
  post.type = req.body.type ? req.body.type : post.type;
  post.notes = req.body.notes ? req.body.notes : post.notes;
  post.hair_type = req.body.hair_type ? req.body.hair_type : post.hair_type;
  post.hair_color = req.body.hair_color ? req.body.hair_color : post.hair_color;
  post.skin_color = req.body.skin_color ? req.body.skin_color : post.skin_color;
  post.height_relative_to_his_peers = req.body.height_relative_to_his_peers
    ? req.body.height_relative_to_his_peers
    : post.height_relative_to_his_peers;

  await post.save();

  return res.status(201).json({
    success: true,
    results: post,
    message: "information updated successfully !",
  });
});

// Update Images post
export const updatePostImages = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);

  if (!post) return next(new Error("Post not found!"));

  // Check owner
  if (req.user._id.toString() !== post.createdBy.toString()) {
    return next(new Error("Not authorized!", { cause: 401 }));
  }

  // Delete old images
  for (const oldImage of post.images) {
    await cloudinary.uploader.destroy(oldImage.id);
  }

  // Upload new images

  const images = [];

  for (const file of req.files.postImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.FOLDER_CLOUD_NAME}/posts/${post.cloudFolder}`,
      }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // Update post with new images
  post.images = images;
  await post.save();

  return res.status(201).json({
    success: true,
    results: post,
    message: "Images Updated successfully !",
  });
});

// Search In Posts
export const searchedPost = asyncHandler(async (req, res, next) => {
  // Extract search parameters from the query
  const {
    firstName,
    lastName,
    gender,
    age,
    recentLocation,
    type,
    hair_type,
    hair_color,
    skin_color,
    height_relative_to_his_peers,
  } = req.query;

  // Construct the dynamic query based on provided parameters
  const searchQuery = {};

  if (firstName) {
    searchQuery.firstName = { $regex: new RegExp(firstName, "i") }; // Case-insensitive regex
  }

  if (lastName) {
    searchQuery.lastName = { $regex: new RegExp(lastName, "i") };
  }

  if (gender) {
    searchQuery.gender = gender;
  }

  if (age) {
    searchQuery.age = parseInt(age, 10); // Assuming age is a number
  }

  if (recentLocation) {
    searchQuery.recentLocation = { $regex: new RegExp(recentLocation, "i") };
  }

  if (type) {
    searchQuery.type = type;
  }
  if (hair_type) {
    searchQuery.hair_type = hair_type;
  }
  if (hair_color) {
    searchQuery.hair_color = hair_color;
  }
  if (skin_color) {
    searchQuery.skin_color = hair_color;
  }
  if (height_relative_to_his_peers) {
    searchQuery.height_relative_to_his_peers = height_relative_to_his_peers;
  }

  // Execute the query
  const posts = await postModel.find(searchQuery);

  return res.json({ success: true, results: posts });
});

// Close Case
export const closeCase = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);

  if (!post) return next(new Error("post not found"));

  // Check owner
  if (req.user._id.toString() !== post.createdBy.toString()) {
    return next(new Error("not authorized !"));
  }
  // update
  post.isClosed = true;
  await post.save();

  return res.json({
    success: true,
    message: "Case closed successfully ",
    results: post,
  });
});

// send report
export const sendReport = asyncHandler(async (req, res, next) => {
  const { reason, description } = req.body;
  const { postId } = req.params;

  // GEt owner's ID
  const post = await postModel.findById(postId);

  if (!post) {
    return next(new Error("Post not found!", { cause: 404 }));
  }

  const createReport = await reportModel.create({
    userId: req.user._id,
    postOwner: post.createdBy,
    postId,
    reason,
    description,
  });

  res.status(201).json({ success: true, results: createReport });
});

// addImage
export const addImage = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const checkPost = await postModel.findById(postId);
  if (!checkPost) {
    return next(new Error("Post Not Found"));
  }
  const images = [];
  let i = 0;
  let featureVector = [];
  for (const file of req.files.postImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.FOLDER_CLOUD_NAME}/posts/${checkPost.cloudFolder}`,
      }
    );
    featureVector = req.body.postImages[i].featureVector[0];
    i = i + 1;
    console.log(featureVector);

    images.push({
      id: public_id,
      url: secure_url,
      featureVector: featureVector,
    });
  }
  const image = checkPost.imageId;
  const newImage = await imageModel.findById(image);

  if (!newImage) {
    return next(new Error("newImage Not Found"));
  }

  for (let i = 0; i < images.length; i++) {
    newImage.images.push(images[i]);
  }

  newImage.save();

  res.status(201).json({ success: true, results: newImage });
});

/*
export const addImage = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const checkPost = await postModel.findById(postId);

  if (!checkPost) {
    return next(new Error("Post Not Found"));
  }

  const images = [];

  // Check if req.body.postImages is defined and is an array
  const postImages = Array.isArray(req.body.postImages)
    ? req.body.postImages
    : [];

  const featureVectors = postImages.map((image) => image.featureVector[0]);

  for (const file of req.files.postImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.FOLDER_CLOUD_NAME}/posts/${checkPost.cloudFolder}`,
      }
    );

    images.push({
      id: public_id,
      url: secure_url,
      featureVector: featureVectors.shift(), // Get the next feature vector
    });
  }

  const imagePostId = checkPost.imageId;

  if (!imagePostId) {
    return next(new Error("ImagePost Not Found"));
  }

  const imagePost = await imageModel.findById(imagePostId);

  if (!imagePost) {
    return next(new Error("ImagePost Not Found in imageModel"));
  }

  // Add the new images to the existing imagePost
  imagePost.images = [...imagePost.images, ...images];

  await imagePost.save();

  res.status(201).json({ success: true, results: imagePost });
});
*/
