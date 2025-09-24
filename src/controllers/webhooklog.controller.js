import {
  createWebhookLog,
  getAllWebhookLogs,
  getWebhookLogById,
  getWebhookLogsByTeam
} from "../models/webhooklog.model.js";

// Create a webhook log
export async function createWebhookLogController(req, res) {
  try {
    const { team_id, event_type, payload } = req.body;

    if (!event_type || !payload) {
      return res.status(400).json({ message: "Event type and payload required" });
    }

    const webhookLog = await createWebhookLog({ teamId: team_id, event_type, payload });

    res.status(201).json({ message: "Webhook logged", webhook_log: webhookLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
