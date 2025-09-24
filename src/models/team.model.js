import pool from "../config/db.js";

// Get user by name
export async function getUserByName(name) {
  const { rows } = await pool.query(
    `SELECT * FROM auths.users WHERE name = $1`,
    [name]
  );
  return rows[0];
}

// Create a new team
export async function createTeam({ name, ownerId }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.teams (name, owner_id)
     VALUES ($1, $2)
     RETURNING *`,
    [name, ownerId]
  );
  return rows[0];
}

// Add a user as a team member
export async function addTeamMember({ teamId, userId, role = 'manager' }) {
  const { rows } = await pool.query(
    `INSERT INTO auths.team_members (team_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [teamId, userId, role]
  );
  return rows[0];
}

// Get team by ID
export async function getTeamById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM auths.teams WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Get all team members
export async function getTeamMembers(teamId) {
  const { rows } = await pool.query(
    `SELECT tm.user_id, u.name, u.email, tm.role
     FROM auths.team_members tm
     JOIN auths.users u ON tm.user_id = u.id
     WHERE tm.team_id = $1`,
    [teamId]
  );
  return rows;
}
