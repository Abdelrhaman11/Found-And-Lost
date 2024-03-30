import { imageModel } from "../../DB/models/image.mode.js";
import { postModel } from "./../../DB/models/post.model.js";

// Function to find matching posts based on specific criteria
let matchingPosts = [];
export async function findMatchingPosts(post) {
  // Define your matching criteria based on the new post attributes

  const matchCriteria = {
    type: post.type === "Lost" ? "Found" : "Lost",
    height_relative_to_his_peers: post.height_relative_to_his_peers,
    skin_color: post.skin_color,
    hair_color: post.hair_color,
    hair_type: post.hair_type,
    eye_color: post.eye_color,
    age: { $gte: post.age - 5, $lte: post.age + 5 },
  };

  // Query the database to find matching posts
  matchingPosts = await postModel.find(matchCriteria);
  return matchingPosts;
}

export async function findMatchingImages(post) {
  if (!matchingPosts) {
    return next(new Error("Not Found", { cause: 401 }));
  }
  const match1 = await imageModel.find({ postId: post._id });

  let imageMatch = [];
  for (let i = 0; i < matchingPosts.length; i++) {
    const match2 = await imageModel.find({ postId: matchingPosts[i]._id });
    // Iterate through each image in match1
    for (let x = 0; x < match1[0].images.length; x++) {
      // Iterate through each image in match2
      for (let y = 0; y < match2[0].images.length; y++) {
        // Compare feature vectors
        if (
          match1[0].images[x].featureVector[0] ===
          match2[0].images[y].featureVector[0]
        ) {
          imageMatch.push(matchingPosts[i]);
        }
      }
    }
  }
  return imageMatch;
}
