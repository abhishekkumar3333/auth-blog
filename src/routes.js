import express from "express";
import userRouter from "./router/user.router.js";
export const router = express.Router();
router.use("/user", userRouter);

