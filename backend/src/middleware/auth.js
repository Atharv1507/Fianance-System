import { decodeJwt } from "jose"
import pool from "../config/db.js"

/**
 * authenticate — Extracts the user ID from the Supabase JWT Bearer token,
 * then looks up the user's role and status from the profiles table.
 * Attaches req.user = { id, role, status }
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: 401, message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]
    let payload
    try {
      payload = decodeJwt(token)
    } catch (err) {
      return res.status(401).json({ status: 401, message: "Invalid token" })
    }

    const userId = payload.sub
    if (!userId) {
      return res.status(401).json({ status: 401, message: "Invalid token: no user ID" })
    }

    // Look up the user's role and status from the profiles table
    const result = await pool.query("SELECT role, status FROM profiles WHERE id = $1", [userId])
    const profile = result.rows[0]

    if (!profile) {
      // User exists in auth but not in profiles — could be during registration
      req.user = { id: userId, role: null, status: null }
    } else {
      req.user = { id: userId, role: profile.role, status: profile.status }
    }

    next()
  } catch (err) {
    console.error("Auth middleware error:", err)
    return res.status(500).json({ status: 500, message: "Authentication failed" })
  }
}

/**
 * authorize — Middleware factory that checks if the authenticated user's role
 * is in the allowed list. ADMIN always passes.
 * 
 * Usage: authorize('USER', 'ANALYST')  →  allows USER, ANALYST, and ADMIN
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 401, message: "Authentication required" })
    }

    const userRole = req.user.role

    // ADMIN can access everything
    if (userRole === "ADMIN") {
      return next()
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 403,
        message: "Access denied: insufficient permissions"
      })
    }

    next()
  }
}
