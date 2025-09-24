import pool from "../config/db.js";

// Add a phone number
export async function addPhoneNumber({ teamId, provider, number, metadata }) {
  const { rows } = await pool.query(
    `INSERT INTO telephony.phone_numbers (team_id, provider, number, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [teamId, provider || null, number, metadata || {}]
  );
  return rows[0];
}

// Get all phone numbers
export async function getAllPhoneNumbers() {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.phone_numbers ORDER BY created_at DESC`
  );
  return rows;
}

// Get phone number by ID
export async function getPhoneNumberById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.phone_numbers WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get phone numbers by team ID
export async function getPhoneNumbersByTeam(teamId) {
  const { rows } = await pool.query(
    `SELECT * FROM telephony.phone_numbers WHERE team_id = $1 ORDER BY created_at DESC`,
    [teamId]
  );
  return rows;
}
