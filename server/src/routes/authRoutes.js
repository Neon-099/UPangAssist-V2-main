const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  getCurrentUser,
  logout
} = require("../controllers/authController");

const { requireAuth } = require("../middlewares/authMiddleware");
const {
  validateRegister,
  validateLogin
} = require("../middlewares/validationMiddleware");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts. Try again later."
  }
});

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

module.exports = router;