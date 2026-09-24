const express = require("express");

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const { requireAuth } = require("../middlewares/authMiddleware");
const {
  validateTaskCreate,
  validateTaskUpdate
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.get("/", requireAuth, getAllTasks);
router.get("/:id", requireAuth, getTaskById);
router.post("/", requireAuth, validateTaskCreate, createTask);
router.patch("/:id", requireAuth, validateTaskUpdate, updateTask);
router.delete("/:id", requireAuth, deleteTask);

module.exports = router;