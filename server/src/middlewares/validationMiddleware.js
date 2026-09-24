function rejectInvalidRequest(res, message) {
  return res.status(400).json({ error: message });
}

function validateRegister(req, res, next) {
  const { name, email, course, password, confirmPassword } = req.body || {};

  if ([name, email, course, password, confirmPassword].some((value) => typeof value !== "string")) {
    return rejectInvalidRequest(res, "Name, email, course, password, and confirmation are required");
  }

  if (name.trim().length < 2 || name.trim().length > 100) {
    return rejectInvalidRequest(res, "Name must be between 2 and 100 characters");
  }

  if (course.trim().length === 0 || course.trim().length > 150) {
    return rejectInvalidRequest(res, "Course must be between 1 and 150 characters");
  }

  if (password.length < 8 || password.length > 128) {
    return rejectInvalidRequest(res, "Password must be between 8 and 128 characters");
  }

  if (password !== confirmPassword) {
    return rejectInvalidRequest(res, "Passwords do not match");
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return rejectInvalidRequest(res, "Email and password are required");
  }

  next();
}

function validateChat(req, res, next) {
  const { question } = req.body || {};

  if (typeof question !== "string" || !question.trim()) {
    return rejectInvalidRequest(res, "Question is required");
  }

  if (question.trim().length > 1000) {
    return rejectInvalidRequest(res, "Question must not exceed 1000 characters");
  }

  next();
}

function validateTaskCreate(req, res, next) {
  const { title, description } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return rejectInvalidRequest(res, "Title is required");
  }

  if (typeof description !== "string" || !description.trim()) {
    return rejectInvalidRequest(res, "Description is required");
  }

  if (title.trim().length > 120) {
    return rejectInvalidRequest(res, "Title must not exceed 120 characters");
  }

  if (description.trim().length > 2000) {
    return rejectInvalidRequest(res, "Description must not exceed 2000 characters");
  }

  if (req.body.completed !== undefined && typeof req.body.completed !== "boolean") {
    return rejectInvalidRequest(res, "Completed must be a boolean");
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const updates = req.body || {};
  const allowedFields = ["title", "description", "completed"];
  const suppliedFields = Object.keys(updates);

  if (suppliedFields.length === 0 || suppliedFields.some((field) => !allowedFields.includes(field))) {
    return rejectInvalidRequest(res, "Only title, description, and completed may be updated");
  }

  if (updates.title !== undefined && (typeof updates.title !== "string" || !updates.title.trim() || updates.title.trim().length > 120)) {
    return rejectInvalidRequest(res, "Title must be between 1 and 120 characters");
  }

  if (updates.description !== undefined && (typeof updates.description !== "string" || !updates.description.trim() || updates.description.trim().length > 2000)) {
    return rejectInvalidRequest(res, "Description must be between 1 and 2000 characters");
  }

  if (updates.completed !== undefined && typeof updates.completed !== "boolean") {
    return rejectInvalidRequest(res, "Completed must be a boolean");
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateChat,
  validateTaskCreate,
  validateTaskUpdate
};
