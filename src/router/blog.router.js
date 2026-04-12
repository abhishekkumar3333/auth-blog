import express from "express";
import { createBlog, toggleLikeBlog } from "../controller/blog.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBlogValidation } from "../validations/blog.validation.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const blogRouter = express.Router();

blogRouter.post("/create", upload.single("image"), validate(createBlogValidation), createBlog);
blogRouter.post("/like/:id", authMiddleware, toggleLikeBlog);
blogRouter.post("/dislike/:id", authMiddleware, toggleLikeBlog);


