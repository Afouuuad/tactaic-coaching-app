// backend/controllers/user.controller.js

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// 📝 REGISTER A NEW USER
export const registerUser = async (req, res) => {
  try {
    // Extract fields from the request body
    const { firstName, surname, email, phoneNumber, password } = req.body;

    // Check for required fields
    if (!firstName || !surname || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Optional: Handle file upload for profile photo
    const file = req.file;
    let profilePhotoUrl = "";
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Combine firstName and surname into a full name
    const fullname = `${firstName} ${surname}`;

    // Create new user
    const newUser = await User.create({
      firstName,
      surname,
      email,
      phoneNumber,
      password: hashedPassword,
      fullname,
      profile: {
        profilePhoto: profilePhotoUrl || "",
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      detail: error.message,
    });
  }
};

// 🔐 LOGIN A USER
export const login = async (req, res) => {
  try {
    // Debug: log the incoming payload
    console.log('Received login payload:', req.body);

    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      console.error("Login failed: Missing email or password");
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Normalized email:", normalizedEmail); // Debugging log

    // Find user by email
    let user = await User.findOne({ email: normalizedEmail });
    console.log("User found:", user); // Debugging log
    if (!user) {
      console.error("Login failed: User not found");
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordMatch); // Debugging log
    if (!isPasswordMatch) {
      console.error("Login failed: Invalid password");
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Generate JWT token using the secret defined in .env (JWT_SECRET)
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Prepare a minimal user object for response
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        user,
        success: true,
        access_token: token, // Ensure the client receives the token under this key
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// 🚪 LOGOUT A USER
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// 📝 UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // The auth middleware should set req.user with the logged-in user's information.
    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Optional: Handle file upload (for example, resume upload)
    const file = req.file;
    let resumeUrl = "";
    let originalFileName = "";
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      resumeUrl = cloudResponse.secure_url;
      originalFileName = file.originalname;
    }

    // Update user properties if provided
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) {
      const skillsArray = skills.split(",");
      user.profile.skills = skillsArray;
    }
    if (resumeUrl) {
      user.profile.resume = resumeUrl;
      user.profile.resumeOriginalName = originalFileName;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

