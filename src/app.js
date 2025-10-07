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

// ✅ Basic test route
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/digidial/users",router);
app.use("/api/digidial/auth",authRouter);
app.use("/api/digidial",teamRoute);
app.use("/api/digidial",teamMemberRouter);
app.use("/api/digidial", leadRoutes);
app.use("/api/digidial",callRouter);
app.use("/api/digidial",phoneNumberRoute);
app.use("/api/digidial",webhookLogRouter);
app.use("/api", twilioRouter);


export default app;