import pool from "../config/db.js"

export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT id, name, role, status, created_at FROM profiles ORDER BY created_at DESC")
    res.json({ data: result.rows })
  } catch (err) {
    next(err)
  }
}
