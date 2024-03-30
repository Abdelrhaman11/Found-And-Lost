import mongoose, { Types, model, Schema } from "mongoose";

// Police Model
export const policeSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  location: {
    type: String,
    required: true,
    default: "Police Station",
  },
  role: {
    type: String,
    enum: ["user", "admin", "police", "dar"],
    default: "police",
  },
});

export const policeModel =
  mongoose.model.Police || model("Police", policeSchema);
