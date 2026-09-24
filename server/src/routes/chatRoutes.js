const express = require("express");

const { requireAuth } = require("../middlewares/authMiddleware");
const { chatLimiter } = require("../middlewares/rateLimitMiddleware");
const { answerQuestion } = require("../controllers/chatController");
const { validateChat } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  chatLimiter,
  validateChat,
  answerQuestion
);

module.exports = router;