import pool from "../config/db.js";

// Create a new webhook log
export async function createWebhookLog({ teamId, event_type, payload }) {
  const { rows } = await pool.query(
    `INSERT INTO telephony.webhook_logs (team_id, event_type, payload)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [teamId || null, event_type, payload]
  );
  return rows[0];
}

// Get all webhook logs
export async function getAllWebhookLogs() {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.webhook_logs ORDER BY received_at DESC`
  );
  return rows;
}

// Get webhook log by ID
export async function getWebhookLogById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.webhook_logs WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all webhook logs by team ID
export async function getWebhookLogsByTeam(teamId) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.webhook_logs WHERE team_id = $1 ORDER BY received_at DESC`,
    [teamId]
  );
  return rows;
}
