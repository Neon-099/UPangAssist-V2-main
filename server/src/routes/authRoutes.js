const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  getCurrentUser,
  logout
} = require("../controllers/authController");

const { requireAuth } = require("../middlewares/authMiddleware");

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

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

module.exports = router;