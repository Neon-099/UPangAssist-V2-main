function notFoundMiddleware(req, res) {
  return res.status(404).json({
    error: "Route not found"
  });
}

function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid resource identifier"
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: "A record with that value already exists"
    });
  }

  return res.status(500).json({
    error: "Internal server error"
  });
}

module.exports = {
  notFoundMiddleware,
  errorMiddleware
};