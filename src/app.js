import express from "express";
import dotenv from "dotenv";
import router from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import teamRoute from "./routes/team.routes.js";
import teamMemberRouter from "./routes/teamembers.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import callRouter from "./routes/call.routes.js";
import phoneNumberRoute from "./routes/phonenumber.routes.js";
import webhookLogRouter from "./routes/webhooklog.routes.js";
import twilioRouter from "./routes/twiml.routes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/users",router);
app.use("/api/auth",authRouter);
app.use("/api",teamRoute);
app.use("/api",teamMemberRouter);
app.use("/api", leadRoutes);
app.use("/api",callRouter);
app.use("/api",phoneNumberRoute);
app.use("/api",webhookLogRouter);
app.use("/twiml", twilioRouter);


export default app;