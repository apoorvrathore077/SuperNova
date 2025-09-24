import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserByMobile } from "../models/user.model.js";




function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "invalid user" });
        }
        const validpassword = await bcrypt.compare(password, user.password);
        if (!validpassword) {
            res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await pool.query(
            "INSERT INTO auths.access_tokens (user_id,token,expires_at,created_at,revoked) VALUES($1,$2,$3,NOW(),false)",
            [user.id, token, expiresAt]
        )

        res.status(201).json({
            message: "Login succesfull", token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profile_pic: user.profile_pic
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
}

export async function forgetPasword(req, res) {
    try {
        const { mobile } = req.body;
        if (!mobile) res.status(401).json({ message: "Please enter mobile number." });
        const user = await findUserByMobile(mobile);
        if (!user) res.status(404).json({ message: "User not found" });
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await pool.query(
            "INSERT INTO auths.otp_tokens(user_id,mobile,otp_code,expires_at,used,created_at) VALUES ($1,$2,$3,$4,false,NOW())",
            [user.id, mobile, otpCode, expiresAt]
        );

        res.status(201).json({ message: "OTP Generated: ", otpCode });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function resetPassword(req, res) {
    try {
        const { mobile, otp_code, newPassword, confirmNewPassword } = req.body;

        if (!mobile || !otp_code || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword != confirmNewPassword) {
            return res.status(401).json({ message: "Password doesn't match." })
        }
        const { rows } = await pool.query(
            "SELECT * FROM auths.otp_tokens WHERE mobile = $1 AND otp_code = $2 AND used = false AND expires_at > NOW()",
            [mobile, otp_code]
        );
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired otp" });
        }
        const otp = rows[0];

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE auths.users SET password = $1 WHERE id = $2",
            [hashedPassword, otp.user_id]
        );

        await pool.query(
            "UPDATE auths.otp_tokens SET used = true WHERE id = $1",
            [otp.id]
        );
        return res.status(201).json({ message: "Password reset sucessfull." })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}
export async function checkUserExist(req, res) {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({ message: "Mobile number required" });
        }
        const user = findUserByMobile(mobile);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(201).json({ message: "User exist proceed with firebase otp." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}





