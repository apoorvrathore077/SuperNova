import {
  createWebhookLog,
  getAllWebhookLogs,
  getWebhookLogById,
  getWebhookLogsByTeam
} from "../models/webhooklog.model.js";
import { updateCallStatusBySid } from "../models/call.model.js";


// Create a webhook log
export async function createWebhookLogController(req, res) {
  try {
    console.log("🔥 Twilio Webhook Received:", req.body); // log the payload
    const payload = req.body; // Twilio POST data
    const callSid = payload.CallSid;
    const callStatus = payload.CallStatus; // queued, ringing, in-progress, completed

    // 1️⃣ Webhook log me save
    await createWebhookLog({
      teamId: payload.team_id || null,
      event_type: `call.${callStatus}`,
      payload
    });

    // 2️⃣ Call table update
    const updateData = { status: callStatus };
    if (callStatus === "completed") updateData.ended_at = new Date();

    await updateCallStatusBySid(callSid, updateData);

    res.status(200).json({ message: "Webhook received" });
  } catch (err) {
    console.error("❌ Twilio webhook error:", err.message);
    return res.status(500).json({error: err.message} );
  }
}

// Get all webhook logs
export async function getAllWebhookLogsController(req, res) {
  try {
    const logs = await getAllWebhookLogs();
    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get webhook log by ID
export async function getWebhookLogByIdController(req, res) {
  try {
    const { id } = req.params;
    const log = await getWebhookLogById(id);
    if (!log) return res.status(404).json({ message: "Webhook log not found" });
    res.json({ webhook_log: log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get webhook logs by team
export async function getWebhookLogsByTeamController(req, res) {
  try {
    const { team_id } = req.params;
    const logs = await getWebhookLogsByTeam(team_id);
    res.json({ team_id, logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
