import pool from "../config/db.js";
export async function updateProfileController(req, res) {
    try {
        const user_id = req.user.id; // JWT middleware should set req.user
        const { name, email, mobile } = req.body;
        let profile_pic = null;

        if (req.file) {
            profile_pic = req.file.path;
        }

        // Check if email already exists
        if (email) {
            const emailCheck = await pool.query(
                "SELECT id FROM auths.users WHERE email = $1 AND id != $2",
                [email, user_id]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Check if mobile already exists
        if (mobile) {
            const mobileCheck = await pool.query(
                "SELECT id FROM auths.users WHERE mobile = $1 AND id != $2",
                [mobile, user_id]
            );
            if (mobileCheck.rows.length > 0) {
                return res.status(400).json({ message: "Mobile number already in use" });
            }
        }

        // Build dynamic update query
        const fields = [];
        const values = [];
        let idx = 1;

        if (name) {
            fields.push(`name = $${idx++}`);
            values.push(name);
        }
        if (email) {
            fields.push(`email = $${idx++}`);
            values.push(email);
        }
        if (mobile) {
            fields.push(`mobile = $${idx++}`);
            values.push(mobile);
        }
        if (profile_pic) {
            fields.push(`profile_pic = $${idx++}`);
            values.push(profile_pic);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        values.push(user_id);
        const query = `UPDATE auths.users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
        const { rows } = await pool.query(query, values);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}