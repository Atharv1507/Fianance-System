import pool from "../config/db.js"

const createFinancialTable = async () => {
    const result = await pool.query(`
        CREATE TABLE if not exists financial_records (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
            type        TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
            category    TEXT NOT NULL,
            notes       TEXT,
            created_by  UUID NOT NULL REFERENCES profiles(id),
            created_at  TIMESTAMPTZ DEFAULT NOW(),
            updated_at  TIMESTAMPTZ DEFAULT NOW()
          );
    `)
}
export default createFinancialTable
