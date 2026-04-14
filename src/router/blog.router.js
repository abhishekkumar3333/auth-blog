import { createBlog, toggleLikeBlog, searchBlog, getTrendingBlogs, getBlogById, getRecentBlogs } from "../controller/blog.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import express from "express";
import { createBlogValidation } from "../validations/blog.validation.js";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const blogRouter = express.Router();

blogRouter.post("/create", authMiddleware, upload.single("image"), validate(createBlogValidation), createBlog);
blogRouter.post("/like/:id", authMiddleware, toggleLikeBlog);
blogRouter.post("/dislike/:id", authMiddleware, toggleLikeBlog);
blogRouter.get("/trending", getTrendingBlogs);
blogRouter.get("/recent", getRecentBlogs);
blogRouter.get("/search", searchBlog);
blogRouter.get("/:id", getBlogById);
