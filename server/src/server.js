require("dotenv").config();

const { loadEnvironment } = require("./config/env");
const { connectDatabase } = require("./config/database");
const { createApp } = require("./app");

async function startServer() {
  const config = loadEnvironment();

  await connectDatabase(config.mongoUri);

  const app = createApp(config);

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});