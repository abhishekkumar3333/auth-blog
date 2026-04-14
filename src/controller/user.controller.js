import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/email.service.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const registerUser = async (req, res) => {
    try {
        const { userName, email, password, bio } = req.body;
        const existingUser = await User.findOne({
            email: email
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User Already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            bio

        })
        await sendEmail(
            email,
            "Welcome to our platform 🎉",
            `Hello ${userName}, Thank you for registering`
        );
        return res.status(201).json({
            success: true,
            message: "user register succesfully",
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "Internal Server Error"
        })
    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }
        const token = jwt.sign({
            id: user.id,
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token
        })
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Errorsss"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (bio) {
            user.bio = bio;
        }

        if (req.file) {
            user.profilePicture = req.file.path;
        }
        await user.save();
        const { password, ...userData } = user._doc;
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: userData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const followUser = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const targetUserId = req.params.id;

        if (loggedInUserId === targetUserId) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            })
        };
        if (!mongoose.Types.ObjectId.isValid(loggedInUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }
        const currentUser = await User.findById(loggedInUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "Current User Not Found" });
        }

        if (!targetUser) {
            return res.status(404).json({
                message: "Target User Not Found"
            })
        };
        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({
                message: "Already following"
            })
        };
        currentUser.following.push(targetUserId);
        targetUser.followers.push(loggedInUserId);
        await currentUser.save();
        await targetUser.save();
        return res.status(200).json({
            success: true,
            message: "User followed successfully"
        })

    } catch (error) {
        console.error("FOLLOW ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const unFollowUser = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const targetUserId = req.params.id;

        if (loggedInUserId === targetUserId) {
            return res.status(400).json({
                message: "You cannot unfollow yourself"
            })
        };
        if (!mongoose.Types.ObjectId.isValid(loggedInUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }
        const currentUser = await User.findById(loggedInUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "Current User Not Found" });
        }

        if (!targetUser) {
            return res.status(404).json({
                message: "Target User Not Found"
            })
        };
        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({
                message: "Not following"
            })
        };
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(loggedInUserId);
        await currentUser.save();
        await targetUser.save();
        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully"
        })

    } catch (error) {
        console.error("UNFOLLOW ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const toggleBookMark = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const isBookMarked = user.bookMarks.includes(blogId);
        if (!isBookMarked) {
            user.bookMarks.push(blogId)
        } else {
            user.bookMarks.pull(blogId)
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: isBookMarked ? "Bookmark removed successfully" : "Bookmark added successfully"
        })
    } catch (error) {
        console.error("BOOKMARK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getBookMark = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate("bookMarks")

        return res.status(200).json({
            success: true,
            message: "Bookmark fetched successfully",
            data: user.bookMarks
        })

    } catch (error) {
        console.error("BOOKMARK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}