import mongoose, { Types, model, Schema } from "mongoose";

export const postSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Lost", "Found"],
    },
    hair_type: {
      type: String,
      required: true,
      enum: ["straight", "wavy", "curly", "coily"],
    },
    hair_color: {
      type: String,
      required: true,
      enum: ["black", "brown", "blond", "white/gray", "red"],
    },
    skin_color: {
      type: String,
      required: true,
      enum: ["very fair", "fair", "medium", "olive", "brown", "black"],
    },
    eye_color:{
      type:String,
      required:true,
      enum:["black","brown","blue","hazel","amber","green","gray"],
    },
    notes: {
      type: String,
    },
    isClosed: {
      type: String,
      enum: ["false", "true"],
      default: "false",
    },
    imageId:{type:Types.ObjectId , ref:"Image",default:null },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    cloudFolder: { type: String, unique: true, required: true },
},

  { timestamps: true }
);

export const postModel = mongoose.model.Post || model("Post", postSchema);
