const express = require("express");
const router = express.Router();
const {Register, Login, Logout, Getuser } = require('../services/authService.js')


// post /api/v1/../
router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/getuser", Getuser);


// Route for login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await authService.login(email, password);
//     res.json({ message: "Login successful", user, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Route for register
// router.post("/register", async (req, res) => {
//   try {
//     const { fullname, email, password } = req.body;
//     const { user, token } = await authService.register(
//       fullname,
//       email,
//       password
//     );
//     res.json({ message: "Registration successful", user, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
