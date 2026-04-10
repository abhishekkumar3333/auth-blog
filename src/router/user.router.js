import express from "express";
import { registerUser, loginUser, updateProfile, followUser, unFollowUser } from "../controller/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../validations/user.validation.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const userRouter = express.Router();
userRouter.post("/register", validate(registerUserSchema), registerUser);
userRouter.post("/login", validate(loginUserSchema), loginUser);
userRouter.put("/profile", authMiddleware, upload.single("profilePicture"), updateProfile);
userRouter.post("/follow/:id", authMiddleware, followUser);
userRouter.post("/unfollow/:id", authMiddleware, unFollowUser);
export default userRouter;  