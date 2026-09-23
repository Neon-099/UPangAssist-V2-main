const argon2 = require("argon2");
const mongoose = require("mongoose");
const User = require("../models/User");
const {
  normalizeEmail,
  isAllowedSchoolEmail
} = require("../utils/emailPolicy");
const { createAccessToken } = require("../utils/jwt");

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/"
  };
}

function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    course: user.course,
    role: user.role,
    status: user.status
  };
}

function setAuthCookie(res, user) {
  const token = createAccessToken(user);
  const cookieName = process.env.COOKIE_NAME || "upang_access_token";

  res.cookie(cookieName, token, getCookieOptions());
}

async function register(req, res) {
  try {
    const name = typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

    const email = normalizeEmail(req.body?.email);
    const course = typeof req.body?.course === "string"
      ? req.body.course.trim()
      : "";

    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    if (!name || !email || !course || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Name, email, course, password, and confirmation are required"
      });
    }

    if (!isAllowedSchoolEmail(email)) {
      return res.status(400).json({
        error: "Only approved school email addresses are allowed"
      });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        error: "Name must be between 2 and 100 characters"
      });
    }

    if (course.length > 150) {
      return res.status(400).json({
        error: "Course must not exceed 150 characters"
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters"
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        error: "Password must not exceed 128 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log({
            receivedEmail: req.body?.email,
            normalizedEmail: email,
            existingUserId: existingUser?._id?.toString() || null,
            database: mongoose.connection.name
            });
      return res.status(409).json({
        error: "An account with this email already exists"
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id
    });

    const user = await User.create({
      name,
      email,
      course,
      passwordHash,
      role: "student",
      status: "active",
      lastLoginAt: new Date()
    });

    setAuthCookie(res, user);

    return res.status(201).json({
      user: toSafeUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0];

    if (duplicateField === "email") {
        return res.status(409).json({
        error: "An account with this email already exists"
        });
    }

    console.error("Unexpected duplicate index:", {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        message: error.message
    });

    return res.status(500).json({
        error: "A database uniqueness conflict occurred"
    });
    }   

    console.error("Registration error:", error.message);

    return res.status(500).json({
      error: "Unable to create account"
    });
  }
}

async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || typeof password !== "string") {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    if (!isAllowedSchoolEmail(email)) {
      return res.status(401).json({
        error: "Invalid school email or password"
      });
    }

    const user = await User.findOne({ email }).select(
      "+passwordHash _id name email course role status"
    );

    if (!user || user.status !== "active") {
      return res.status(401).json({
        error: "Invalid school email or password"
      });
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid school email or password"
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    setAuthCookie(res, user);

    return res.status(200).json({
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: "Unable to log in"
    });
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    user: toSafeUser(req.user)
  });
}

function logout(req, res) {
  const cookieName = process.env.COOKIE_NAME || "upang_access_token";

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.status(204).send();
}

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};