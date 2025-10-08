import express from "express";
import {
  createWebhookLogController,
  getAllWebhookLogsController,
  getWebhookLogByIdController,
  getWebhookLogsByTeamController
} from "../controllers/webhooklog.controller.js";

const webhookLogRouter = express.Router();

// Create a webhook log
webhookLogRouter.post("/telephony/twilio-call-status", createWebhookLogController);

// Get all webhook logs
webhookLogRouter.get("/telephony/webhook-logs", getAllWebhookLogsController);

// Get webhook log by ID
webhookLogRouter.get("/telephony/webhook-logs/:id", getWebhookLogByIdController);

// Get webhook logs by team
webhookLogRouter.get("/telephony/webhook-logs/team/:team_id", getWebhookLogsByTeamController);

export default webhookLogRouter;
