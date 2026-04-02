import pool from "../config/db.js"

export const getFinancialSummary = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT type, COALESCE(SUM(amount), 0)::numeric(12,2) AS total
      FROM financial_records
      GROUP BY type
    `)
    res.json({ data: result.rows })
  } catch (err) {
    next(err)
  }
}
