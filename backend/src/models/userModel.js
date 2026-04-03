import pool from "../config/db.js"

export const createUserService = async (name, id) => {
    try {
        const result = await pool.query("INSERT INTO profiles (name,id,status,role) VALUES ($1, $2,'INACTIVE','VIEWER') RETURNING *", [name, id])
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}