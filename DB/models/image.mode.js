import mongoose, { Types, model, Schema } from "mongoose";

// Image 
export const imageSchema = new Schema({
  images: [
    {
      id: { type: String, required: true },
      url: { type: String, required: true },
      featureVector: { type: Array, default: [] },
    },
  ],
  postId: { type: Types.ObjectId, ref: "Post", required: true },
});

export const imageModel = mongoose.model.Images || model("Image", imageSchema);
