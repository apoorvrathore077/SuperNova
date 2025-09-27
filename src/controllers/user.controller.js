import { create, findUserByEmail } from "../models/user.model.js"
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export async function createUser(req, res) {
    try {
        const { name, email, password, mobile,global_role} = req.body;
        const profile_pic = req.file ? req.file.filename : null;
        if (!name || !email || !password || !mobile) {
            res.status(400).json({ message: "All fields are required" });
        }
        if (mobile.length < 10) {
            res.status(400).json({ message: "Please enter valid number" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await create({
            name,
            email,
            mobile,
            profile_pic: profile_pic || null,
            password: hashedPassword,
            global_role:global_role
        });
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}
export async function fetchProfile(req, res) {
    try {
        const { id } = req.user;

        const { rows } = await pool.query(
            `SELECT  
                u.name,
                u.email,
                u.mobile,
                u.profile_pic,
                t.name AS team_name,
                tm.role
             FROM auths.team_members tm
             JOIN auths.users u ON tm.user_id = u.id
             JOIN auths.teams t ON tm.team_id = t.id
             WHERE u.id = $1`,
            [id] 
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Profile not found." });
        }

        return res.status(200).json({ message: "Profile fetched", user: rows[0] });
    } catch (err) {
        console.error("fetchProfile error:", err.message);
        return res.status(500).json({ message: err.message });
    }
}

export async function fetchAllUser(req,res){
    try{
        const users = await fetchAllUser();
        if(!users) return res.status(400).json({message:"User not found"});
        return res.status(201).json({message:"User fetched Succesfully",users});
    }catch(err){
        document.writeln(err.message);
        return res.status(500).json({error:err.message});
    }
}



