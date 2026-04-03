import pool from "../config/db.js";

export const getRegisteredService = async () => {
    const result = await pool.query("SELECT * FROM auth.users");
    return result.rows;
}

export const getUserRoleService = async (id) => {
    const result = await pool.query("SELECT role FROM profiles WHERE id = $1", [id])
    return result.rows[0]
}