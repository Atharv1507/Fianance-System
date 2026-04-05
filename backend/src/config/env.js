import dotenv from "dotenv";

dotenv.config();

const required = [
  "PORT",
  "SUPABASE_URL",
  "SUPABASE_JWT_AUDIENCE",
  "SUPABASE_DB_URL",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseJwtAudience: process.env.SUPABASE_JWT_AUDIENCE,
  supabaseDbUrl: process.env.SUPABASE_DB_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
};
