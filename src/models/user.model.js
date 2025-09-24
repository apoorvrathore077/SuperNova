import pool from "../config/db.js";

export async function create({ name, email, mobile, profile_pic, password }) {
    const { rows } = await pool.query(
        "INSERT INTO auths.users(name,email,mobile,profile_pic,password) VALUES ($1, $2, $3,$4,$5) RETURNING *",
        [name, email, mobile, profile_pic, password]
    );
    return rows[0];
}

export async function findUserByEmail(email) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM auths.users WHERE email = $1',
            [email]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function findUserByMobile(mobile) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM auths.users WHERE mobile = $1',
            [mobile]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export default create;