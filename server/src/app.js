const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
// const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const healthRoutes = require("./routes/healthRoutes");

const {
  globalLimiter
} = require("./middlewares/rateLimitMiddleware");

const {
  notFoundMiddleware,
  errorMiddleware
} = require("./middlewares/errorMiddleware");

function createApp(config) {
  const app = express();

  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin"
      }
    })
  );

  app.use(
    cors({
      origin: config.frontendOrigin,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type"]
    })
  );

  app.use(express.json({ limit: "20kb" }));
  app.use(cookieParser());
  app.use(globalLimiter);

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/chat", chatRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = {
  createApp
};