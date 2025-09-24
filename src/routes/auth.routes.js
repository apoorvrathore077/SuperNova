import express from "express";
import { forgetPasword,resetPassword,login,checkUserExist } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authtoken.middleware.js";

const authRouter = express.Router();
authRouter.post("/login",login)
authRouter.post("/forget",forgetPasword);
authRouter.post("/reset",resetPassword);
authRouter.post("/check-user",checkUserExist);

export default authRouter;