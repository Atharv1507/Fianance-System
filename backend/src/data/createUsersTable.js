import pool from "../config/db.js"

const createUsersTable = async () => {
  const result = await pool.query(`
        CREATE TABLE if not exists profiles(
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ANALYST', 'ADMIN')),
    status      TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
  );
    `)
}
export default createUsersTable