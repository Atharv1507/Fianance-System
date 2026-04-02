import pool from "../config/db.js";

export const getRegisteredService = async () => {
    const result = await pool.query("SELECT * FROM auth.users");
    return result.rows;
}