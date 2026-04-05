import pool from "../config/db.js"

export const createUserService = async (name, id) => {
    try {
        const result = await pool.query("INSERT INTO profiles (name,id,status,role) VALUES ($1, $2,'INACTIVE','USER') RETURNING *", [name, id])
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}
export const createTransactionService = async (id, amount, type, category, notes) => {
    try {
        const result = await pool.query("INSERT INTO financial_records (created_by,amount,type,category,notes) VALUES ($1, $2,$3,$4,$5) RETURNING *", [id, amount, type, category, notes])
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}
export const getMyTransactionsService = async (id) => {
    try {
        const result = await pool.query("SELECT * FROM financial_records WHERE created_by = $1 ORDER BY created_at DESC", [id])
        return result.rows;
    } catch (err) {
        console.log(err)
    }
}
export const updateTransactionService = async (txnId, userId, amount, type, category, notes) => {
    try {
        const result = await pool.query(
            "UPDATE financial_records SET amount = $1, type = $2, category = $3, notes = $4, updated_at = NOW() WHERE id = $5 AND created_by = $6 RETURNING *",
            [amount, type, category, notes, txnId, userId]
        )
        return result.rows[0];
    } catch (err) {
        console.log(err)
    }
}