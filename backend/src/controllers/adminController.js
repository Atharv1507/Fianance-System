import pool from "../config/db.js"

export const getAdminOverview = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS profile_count FROM profiles")
    res.json({ data: result.rows[0] })
  } catch (err) {
    next(err)
  }
}
