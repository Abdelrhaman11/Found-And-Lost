import mongoose, { Types, model, Schema } from "mongoose";

// Police Model
export const darSchema = new Schema({
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
  name:{
    type:String,
    required:true,
    enum:["Dar Alamal" , "Dar ALHayat" , "Wydad","Nova Vita Rehabilitation Center" ,"Dar Lamset Hanan El Shrouk"]
  },
  role:{
    type:String,
    enum:["user","admin","police","dar"],
    default:"dar",
  },
});

export const darModel =
  mongoose.model.dar || model("Dar", darSchema);
