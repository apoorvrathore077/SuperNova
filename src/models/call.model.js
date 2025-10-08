import pool from "../config/db.js";

// Create a new call
export async function createCall({
  teamId,
  call_ssid,
  from_number,
  to_number,
  status,
  started_at,
  ended_at,
  recording_url
}) {
  const { rows } = await pool.query(
    `INSERT INTO telephony.calls
     (team_id, call_ssid, from_number, to_number, status, started_at, ended_at, recording_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [teamId || null, call_ssid || null, from_number || null, to_number || null, status || null, started_at || null, ended_at || null, recording_url || null]
  );
  return rows[0];
}

// Get all calls
export async function getAllCalls() {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.calls ORDER BY started_at DESC`
  );
  return rows;
}

// Get a call by ID
export async function getCallById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.calls WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all calls by team ID
export async function getCallsByTeamId(teamId) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.calls WHERE team_id = $1 ORDER BY started_at DESC`,
    [teamId]
  );
  return rows;
}

// models/call.model.js
export async function updateCallStatusBySid(callSid, updateData) {
  const { status, ended_at } = updateData;
  const query = `
    UPDATE telephony.calls
    SET status = $1,
        ended_at = $2
    WHERE twilio_call_sid = $3
    RETURNING *;
  `;
  const values = [status, ended_at || null, callSid];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

