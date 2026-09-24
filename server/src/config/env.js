const requiredEnvironmentVariables = [
  "MONGODB_URI",
  "JWT_SECRET",
  "ALLOWED_EMAIL_DOMAINS"
];

function loadEnvironment() {
  for (const variable of requiredEnvironmentVariables) {
    if (!process.env[variable]) {
      throw new Error(`${variable} is not configured`);
    }
  }

  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
    cookieName: process.env.COOKIE_NAME || "upang_access_token",
    frontendOrigin:
      process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    allowedEmailDomains: process.env.ALLOWED_EMAIL_DOMAINS
      .split(",")
      .map((domain) => domain.trim().toLowerCase())
      .filter(Boolean)
  };
}

module.exports = {
  loadEnvironment
};