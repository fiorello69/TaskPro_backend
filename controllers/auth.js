import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import controllerWrapper from "../helpers/decorators.js";
import "dotenv/config";

const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;
const bcryptHash = bcrypt.hash;
const bcryptCompare = bcrypt.compare;
const jwtSign = jwt.sign;
const jwtVerify = jwt.verify;

async function register(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcryptHash(password, 10);
  const avatarURL = "";

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const isValidPassword = await bcryptCompare(password, user.password);
  if (!isValidPassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };

  const accessToken = jwtSign(payload, ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
  const refreshToken = jwtSign(payload, REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });
  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme,
      avatarURL: user.avatarURL,
    },
  });
}

async function refresh(req, res) {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwtVerify(token, REFRESH_TOKEN_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Token invalid");
    }
    const payload = { id };
    const accessToken = jwtSign(payload, ACCESS_TOKEN_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwtSign(payload, REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
    });
    await User.findByIdAndUpdate(id, { accessToken, refreshToken });
    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    throw HttpError(403, error.message);
  }
}

async function getCurrent(req, res) {
  const { _id, name, email, theme, token, avatarURL } = req.user;
  res.json({
    token,
    user: {
      _id,
      name,
      email,
      theme,
      avatarURL,
    },
  });
}

async function logout(req, res) {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { accessToken: "", refreshToken: "" });
  res.status(204).json();
}

async function updateTheme(req, res) {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    select: "-password -createdAt -updatedAt",
  });
  res.json(result);
}

async function updateProfile(req, res) {
  const { _id } = req.user;

  if (!req.file) {
    const hashedPassword = await bcryptHash(req.body.password, 10);
    const result = await User.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        password: hashedPassword,
      },
      { new: true, select: "-password -createdAt -updatedAt" }
    );
    res.json(result);
    return;
  }

  const hashedPassword = await bcryptHash(req.body.password, 10);
  const upload = req.file.path;

  const result = await User.findByIdAndUpdate(
    _id,
    {
      ...req.body,
      password: hashedPassword,
      avatarURL: upload,
    },
    { new: true, select: "-password -createdAt -updatedAt" }
  );
  res.json(result);
}

async function getHelpEmail(req, res) {
  const { email, comment } = req.body;

  const helpReq = {
    to: "taskproteam5@gmail.com",
    subject: "User need help",
    html: `<p> Email: ${email}, Comment: ${comment}</p>`,
  };
  await sendEmail(helpReq);
  const helpRes = {
    to: email,
    subject: "Support",
    html: `<p>Thank you for you request! We will consider your comment ${comment}</p>`,
  };
  await sendEmail(helpRes);

  res.json({
    message: "Reply email sent",
  });
}

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateTheme: controllerWrapper(updateTheme),
  updateProfile: controllerWrapper(updateProfile),
  getHelpEmail: controllerWrapper(getHelpEmail),
  refresh: controllerWrapper(refresh),
};
