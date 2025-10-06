import pool from "../config/db.js";


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
