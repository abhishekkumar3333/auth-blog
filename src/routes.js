import express from "express";
import { userRouter } from "./router/user.router.js";
import { blogRouter } from "./router/blog.router.js";
import { commentRouter } from "./router/comment.router.js";
export const router = express.Router();
router.use("/user", userRouter);
router.use("/blog", blogRouter);
router.use("/comment", commentRouter);

