import {createUser, fetchProfile} from "../controllers/user.controller.js";
import express from "express";
import { upload } from "../middleware/uploads.middleware.js";
import { authenticateToken } from "../middleware/authtoken.middleware.js";
import { updateProfileController } from "../controllers/updateprofile.controller.js";

const router = express.Router();

router.post("/signup",upload.single("profile_pic"),createUser);
router.get("/profile",authenticateToken,fetchProfile);
router.put("/updateProfile",authenticateToken,upload.single("profile_pic"),updateProfileController);
export default router;



            