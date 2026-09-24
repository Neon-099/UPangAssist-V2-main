const express = require("express");

const { requireAuth } = require("../middlewares/authMiddleware");
const { chatLimiter } = require("../middlewares/rateLimitMiddleware");
const { answerQuestion } = require("../controllers/chatController");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  chatLimiter,
  answerQuestion
);

module.exports = router;