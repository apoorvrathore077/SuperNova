import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { rows } = await pool.query(
            "SELECT * FROM auths.access_tokens WHERE token = $1 AND revoked = false AND expires_at > NOW()",
            [token]  // 👈 wrap in array
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(403).json({ error: err.message });
    }
}
