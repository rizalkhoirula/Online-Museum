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
  const isFirstAccount = (await User.countDocuments()) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const { username, email, password } = req.body;

  const createUser = await User.create({
    username,
    email,
    password,
    role,
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
  if (userData && (await userData.comparePassword(req.body.password))) {
    sendToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

const Logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
  });
  return res.status(200).json({
    message: "Logout Berhasil",
  });
};

const Getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: 0 });

    if (user) {
      return res.status(200).json({
        user,
      });
    }

    return res.status(404).json({
      message: "User tidak ditemukan",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = { Login, Register, Logout, Getuser };
