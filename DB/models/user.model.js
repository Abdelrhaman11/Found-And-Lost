import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
   name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      min: 4,
      max: 15,
    },
    nId:{
      type:Number,
      required:true
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
      min: 8,
      max: 16,
    },
    role:{
      type:String,
      enum:["user","admin","police","dar"],
      default:"user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    Location: {
      type: String,
      enum: [
        "New Valley",
        "Matruh",
        "Red Sea",
        "Giza",
        "South Sinai",
        "North Sinai",
        "Suez",
        "Beheira",
        "Helwan",
        "Sharqia",
        "Dakahlia",
        "Kafr el-Sheikh",
        "Alexandria",
        "Monufia",
        "Minya",
        "Gharbia",
        "Faiyum",
        "Qena",
        "Asyut",
        "Sohag",
        "Ismailia",
        "Beni Suef",
        "Qalyubia",
        "Aswan",
        "Damietta",
        "Cairo",
        "Port Said",
        "Luxor",
      ],
    },
    forgetCode: String,
    activationCode: String,

    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/daho0a8yn/image/upload/v1700548603/LostAndFoundDefaults/user/facebook-avatar-th3experte-com_blatj0_cru5fn.jpg",
      },
      id: {
        type: String,
        default:
          "LostAndFoundDefaults/user/facebook-avatar-th3experte-com_blatj0_cru5fn",
      },
    },
    
    coverImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/daho0a8yn/image/upload/v1700554004/LostAndFoundDefaults/user/facebook-avatar-th3experte-com_blatj0_cru5fn_s1mb8y.jpg",
      },
      id: {
        type: String,
        default:
          "LostAndFoundDefaults/user/facebook-avatar-th3experte-com_blatj0_cru5fn_s1mb8y",
      },
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model.User || model("User", userSchema);
