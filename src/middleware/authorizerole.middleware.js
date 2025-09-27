import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export  function authorizeRole(requiredRole) {
    return async (req, res, next) => {
        try {
            const { team_id } = req.body;
            if (!team_id) return res.status(400).json({ message: "Team id not found." });
            const { rows } = await pool.query(
                "SELECT role from auths.team_members where team_id = $1 AND user_id = $2",
                [team_id, req.user.id]
            );
            if (rows.length === 0) {
                return res.status(403).json({ message: "Not a team member" });
            }
            const userRole = rows[0].role;

            // Simple hierarchy: owner > admin > member
            const rolePriority = { owner: 3, admin: 2, member: 1 };
            if (rolePriority[userRole] >= rolePriority[requiredRole]) {
                return next();
            } else {
                return res.status(403).json({ message: "Insufficient permissions" });
            }
        } catch (err) {
            console.error("Role auth error:", err);
            return res.status(500).json({ message: "Server error" });
        }
    }
}