const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    service: "upang-assist-api",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;