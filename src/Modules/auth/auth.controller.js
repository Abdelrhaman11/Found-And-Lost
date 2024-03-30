import { userModel } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import randomstring from "randomstring";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails.js";
import { tokenModel } from "../../../DB/models/token.model.js";

// SignUp
export const signup = asyncHandler(async (req, res, next) => {
  const { name, nId, email, password } = req.body;

  const isUser = await userModel.findOne({ email });
  if (isUser)
    return next(new Error("Email already registerd !", { cause: 409 }));

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const activationCode = crypto.randomBytes(64).toString("hex");

  const user = await userModel.create({
    name,
    nId,
    email,
    password: hashPassword,
    activationCode,
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${activationCode}`;

  const html = `
      <button class="border rounded-pill  " ><a href="${link}">Activate Email</a></button>
      `;

  const isSend = sendEmail({ to: email, subject: "Activate Account", html });

  return isSend
    ? res.json({ success: true, message: "Please check your Email !" })
    : next(new Error("Somthing went wrong"));
});

// Activate account
export const activateAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { activationCode: req.params.activationCode },
    {
      isConfirmed: true,
      $unset: { activationCode: 1 },
    }
  );
  if (!user) {
    return next(new Error("User not found !", { cause: 404 }));
  }
  return res.json({
    message:
      "Congratulation, your account is now activated !, try to login Now",
  });
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid Email !", { cause: 400 }));

  if (!user.isConfirmed)
    return next(new Error("Email isn't Activated !", { cause: 400 }));

  const match = bcryptjs.compareSync(password, user.password);

  if (!match) return next(new Error("Invalid Password", { cause: 400 }));

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "3d",
    }
  );

  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  user.status = "online";
  await user.save();
  return res.json({ success: true, results: token });
});

// Login Admin
export const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid Email !", { cause: 400 }));

  if (!user.isConfirmed)
    return next(new Error("Email isn't Activated !", { cause: 400 }));

  const match = bcryptjs.compareSync(password, user.password);

  if (!match) return next(new Error("Invalid Password", { cause: 400 }));

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.TOKEN_KEY,
    {
      expiresIn: "3d",
    }
  );

  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  user.status = "online";
  await user.save();
  return res.json({ success: true, results: token });
});

// Send forget code
export const sendForgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return next(new Error("In-Valid Email "));

  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  user.forgetCode = code;
  await user.save();

  const html = `
    <h1>${code}</h1>`;

  const isSend =await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html,
  });

  return isSend
    ? res.json({ success: true, message: "check your email " })
    : next(new Error("somthing went wrong"));
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, forgetCode, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid Email "));
  if (user.forgetCode !== forgetCode) return next(new Error("Invalid code "));

  user = await userModel.findOneAndUpdate(
    { email },
    { $unset: { forgetCode: 1 } }
  );
  user.password = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND));
  await user.save();

  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  return res.json({
    success: true,
    message: "Password Changed ! Try to login ",
  });
});
