import express from "express";
import { registerUser, loginUser } from "../controller/user.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema, loginUserSchema } from "../validations/user.validation.js";
const userRouter = express.Router();

userRouter.post("/register", validate(registerUserSchema), registerUser);
userRouter.post("/login", validate(loginUserSchema), loginUser);

export default userRouter;