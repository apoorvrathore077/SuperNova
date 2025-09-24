import pool from "../config/db.js";

// Create a new lead
export async function createLead({ teamId, phone, name, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO crm.leads (team_id, phone, name, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [teamId || null, phone, name || null, notes || null]
  );
  return rows[0];
}

// Get a lead by ID
export async function getLeadById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM crm.leads WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all leads
export async function getAllLeads() {
  const { rows } = await pool.query(
    `SELECT * FROM crm.leads ORDER BY created_at DESC`
  );
  return rows;
}

// Get all leads for a specific team
export async function getLeadsByTeamId(teamId) {
  const { rows } = await pool.query(
    `SELECT * FROM crm.leads WHERE team_id = $1 ORDER BY created_at DESC`,
    [teamId]
  );
  return rows;
}
