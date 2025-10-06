import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { findUserByMobile } from "../models/user.model.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(req, res) {
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

        try {
            const message = await client.messages.create({
                body: `Your OTP code is: ${otpCode}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: mobile // make sure this includes country code, e.g., +91XXXXXXXXXX
            });
            console.log('OTP sent:', message.sid);
        } catch (err) {
            console.log("SMS not sent", err.message);
            return res.status(500).json({ error: "SMS not sent", message: err.message });
        }

        res.status(201).json({ message: "OTP Generated: ", otpCode });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function verifyOtp(req, res) {
    try {
        const { mobile, otp_code} = req.body;
        const user = await findUserByMobile(mobile);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!mobile || !otp_code ) {
            return res.status(400).json({ message: "All fields are required" });
        }
       
        const { rows } = await pool.query(
            "SELECT * FROM auths.otp_tokens WHERE mobile = $1 AND otp_code = $2 AND used = false AND expires_at > NOW()",
            [mobile, otp_code]
        );
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired otp" });
        }
        const otp = rows[0];


        await pool.query(
            "UPDATE auths.otp_tokens SET used = true WHERE id = $1",
            [otp.id]
        );
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
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
        return res.status(500).json({ message: err.message });
    }

}







