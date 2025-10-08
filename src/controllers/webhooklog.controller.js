import {
  createWebhookLog,
  getAllWebhookLogs,
  getWebhookLogById,
  getWebhookLogsByTeam
} from "../models/webhooklog.model.js";
import { getCallByTwilioSid } from "../models/call.model.js";

export async function createWebhookLogController(req, res) {
  try {
    console.log("🔥 Twilio Webhook Received:", req.body);

    const payload = req.body;

    // 1️⃣ Get Call from DB using CallSid
    let callRecord = null;
    if (payload.CallSid) {
      callRecord = await getCallByTwilioSid(payload.CallSid); // ✅ Need to implement this in call.model.js
    }

    const team_id = callRecord?.team_id || null; // team_id from DB

    // 2️⃣ Determine event type
    const event_type = payload.CallStatus ? `call.${payload.CallStatus}` : "unknown";

    if (!team_id) {
      console.warn("⚠️ Team ID not found for CallSid:", payload.CallSid);
      // optional: reject or allow null if table allows
    }

    // 3️⃣ Create webhook log
    const webhookLog = await createWebhookLog({
      teamId: team_id,
      event_type,
      payload,
    });

    console.log("✅ Webhook logged:", webhookLog.id);
    res.status(201).json({ message: "Webhook logged ✅", webhook_log: webhookLog });

  } catch (error) {
    console.error("❌ Twilio webhook error:", error);
    res.status(500).json({ error: error.message });
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
