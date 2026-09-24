require("dotenv").config();

const fs = require("fs");
const https = require("https");

const { loadEnvironment } = require("./config/env");
const { connectDatabase } = require("./config/database");
const { createApp } = require("./app");

async function startHttpsServer() {
  const config = loadEnvironment();
  const keyPath = process.env.HTTPS_KEY_PATH;
  const certificatePath = process.env.HTTPS_CERT_PATH;
  const httpsPort = Number(process.env.HTTPS_PORT || 3443);

  if (!keyPath || !certificatePath) {
    throw new Error("HTTPS_KEY_PATH and HTTPS_CERT_PATH are required");
  }

  await connectDatabase(config.mongoUri);

  const app = createApp({
    ...config,
    frontendOrigin:
      process.env.FRONTEND_ORIGIN || "https://localhost:5173"
  });

  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certificatePath)
    },
    app
  );

  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS API running on https://localhost:${httpsPort}`);
  });
}

startHttpsServer().catch((error) => {
  console.error("HTTPS server startup failed:", error.message);
  process.exit(1);
});
