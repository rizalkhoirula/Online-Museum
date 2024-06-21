const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const asyncHandler = require("../middleware/AsyncHandler");

//generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// JWT Cookie
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    data: user,
  });
};

const Register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const createUser = await User.create({
    username,
    email,
    password,
  });

  // JWT Process
  sendToken(createUser, 201, res);
});

const Login = asyncHandler(async (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(400);
    throw new Error("Inputan email dan password tidak boleh kosong");
  }
  const userData = await User.findOne({
    email: req.body.email,
  });
  if (userData && (await userData. comparePassword(req.body.password))) {
    sendToken(userData)
  } else {
    res.status(400);
    throw new Error("Invalid userx");
  }
});

const Logout = (req, res) => {
  res.send("Logout Berhasil");
};

const Getuser = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

module.exports = { Login, Register, Logout, Getuser };
