import express from "express";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const authRouter = express.Router();
authRouter.post("/send-otp",sendOtp);
authRouter.post("/verify",verifyOtp);

export default authRouter;




