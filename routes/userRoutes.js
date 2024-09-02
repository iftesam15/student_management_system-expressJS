const express = require("express");
const { check } = require("express-validator");
const { registerUser, loginUser, getUserInfo, getAllUsers, forgetPassword, resetPassword } = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);
router.post(
  "/forget-password",
  [
    check("email", "Please include a valid email").isEmail(),
  ],
  forgetPassword
);

router.post(
  "/reset-password",
  [
    check("token", "Reset token is required").not().isEmpty(),
    check("newPassword", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  resetPassword
);
// Protected route to get user info
router.get("/me", authMiddleware, getUserInfo);
router.get("/", authMiddleware, getAllUsers)

module.exports = router;
