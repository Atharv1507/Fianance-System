import pool from "../config/db.js"

export const getAllAnalyticsService = async () => {
    const result = await pool.query(`
    SELECT f.*, p.name as created_by_name 
    FROM financial_records f 
    LEFT JOIN profiles p ON f.created_by = p.id 
    ORDER BY f.created_at DESC`)
    return result.rows
}