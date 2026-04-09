import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/email.service.js"
import jwt from "jsonwebtoken"
export const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
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
            password: hashedPassword

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
        console.log(isPasswordValid, "isPasswordValid")
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

