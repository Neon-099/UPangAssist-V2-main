const mongoose = require("mongoose");
const Task = require("../models/Task");

function getTaskFilter(req, taskId) {
  const filter = {
    _id: taskId
  };

  if (req.user.role !== "admin") {
    filter.author = req.user._id;
  }

  return filter;
}

async function getAllTasks(req, res) {
  try {
    const filter = req.user.role === "admin"
      ? {}
      : { author: req.user._id };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch {
    return res.status(500).json({
      error: "Unable to retrieve tasks"
    });
  }
}

async function getTaskById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const task = await Task.findOne(
      getTaskFilter(req, req.params.id)
    );

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    return res.status(200).json(task);
  } catch {
    return res.status(500).json({
      error: "Unable to retrieve task"
    });
  }
}

async function createTask(req, res) {
  try {
    const title = typeof req.body?.title === "string"
      ? req.body.title.trim()
      : "";

    const description = typeof req.body?.description === "string"
      ? req.body.description.trim()
      : "";

    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required"
      });
    }

    const task = await Task.create({
      title,
      description,
      completed: req.body.completed === true,
      author: req.user._id
    });

    return res.status(201).json(task);
  } catch {
    return res.status(500).json({
      error: "Unable to create task"
    });
  }
}

async function updateTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const updates = {};

    if (typeof req.body?.title === "string") {
      updates.title = req.body.title.trim();
    }

    if (typeof req.body?.description === "string") {
      updates.description = req.body.description.trim();
    }

    if (typeof req.body?.completed === "boolean") {
      updates.completed = req.body.completed;
    }

    const task = await Task.findOneAndUpdate(
      getTaskFilter(req, req.params.id),
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    return res.status(200).json(task);
  } catch {
    return res.status(500).json({
      error: "Unable to update task"
    });
  }
}

async function deleteTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const task = await Task.findOneAndDelete(
      getTaskFilter(req, req.params.id)
    );

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch {
    return res.status(500).json({
      error: "Unable to delete task"
    });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};