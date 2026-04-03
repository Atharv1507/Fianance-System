import pool from "../config/db.js";

export const getUsersService = async () => {
    try {
        const result = await pool.query("SELECT id, name, role, status, created_at FROM profiles ORDER BY created_at DESC")
        return result.rows;
    } catch (err) {
        console.log(error)
    }
}

export const editUserService = async (name, id, role, status) => {
    try {
        const result = await pool.query("UPDATE profiles SET name = $1, role = $2, status = $3 WHERE id = $4 RETURNING *", [name, role, status, id])
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}
export const deleteUserService = async (id) => {
    try {
        const result = await pool.query("DELETE FROM profiles WHERE id = $1 RETURNING *", [id])
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}

