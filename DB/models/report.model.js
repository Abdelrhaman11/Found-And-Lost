import mongoose, { Types, model, Schema } from "mongoose";

const reportSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },postOwner: {
        type: Types.ObjectId,
        ref: "User", 
        required: true,
      },
    reason: {
      type: String,
      required: true,
      enum: ["spam", "inappropriate content", "harassment", "other"],
    },
    description: {
        type: String,
      },
  },
  {
    timestamps: true,
  }
);

export const reportModel =
  mongoose.model.Report || model("Report", reportSchema);
