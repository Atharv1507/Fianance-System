# Zorvyn Backend API

A high-performance Node.js & Express REST API for the Zorvyn financial management system. This backend handles user profile synchronization, role-based access control (RBAC), and transaction processing with a focus on security and data integrity.

---

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Supabase)
- **Auth**: Supabase Auth (JWT Integration)
- **Token Handling**: `jose` for secure JWT decoding
- **CORS**: Enabled for frontend integration

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- A Supabase Project with Auth enabled
- PostgreSQL Connection String

### Installation

1.  **Clone the repository** (if not already done)
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Configure Environment Variables**:
    Create a `.env` file in the `backend` root:
    ```env
    PORT=8080
    DB_URL=your_supabase_db_url
    DB_PORT=6543
    DB_NAME=postgres
    DB_USER=postgres.[project_ref]
    DB_PASSWORD=your_db_password
    ```
5.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```

---

##  Database Architecture

The backend uses two primary tables within the `public` schema. Tables are automatically initialized/ensured on server startup.

### `profiles`
Stores application-specific user data tied to Supabase Auth.
- `id` (UUID, PK): References `auth.users.id`
- `name` (TEXT): Full name of the user
- `role` (ENUM): `USER`, `ANALYST`, or `ADMIN`
- `status` (ENUM): `ACTIVE` or `INACTIVE`
- `timestamps`: `created_at`, `updated_at`

### `financial_records`
Stores all income and expense transactions.
- `id` (UUID, PK): Auto-generated
- `amount` (NUMERIC): Positive values only
- `type` (ENUM): `INCOME` or `EXPENSE`
- `category` (TEXT): Transaction categorization
- `notes` (TEXT): Optional description
- `created_by` (UUID): References `profiles.id`
- `timestamps`: `created_at`, `updated_at`

---

##  Security & RBAC

The API uses a two-tier middleware system:

1.  **`authenticate`**: Extracts the Bearer token from the `Authorization` header, decodes the Supabase JWT, and attaches the user's role and status to `req.user`.
2.  **`authorize(...roles)`**: Verifies if the authenticated user has sufficient permissions.
    *   **ADMIN**: Master access to all endpoints.
    *   **ANALYST**: Access to system-wide analytics records.
    *   **USER**: Access to their own transactions only.

### Inactive Account Guard
Users with `status = 'INACTIVE'` are blocked from performing transactions at the middleware level, even if they have a valid session.

---

## API Endpoints

### Auth Configuration
- `GET /api/auth/role/:id` - Fetch role and status for a logged-in user.

### User Management (ADMIN Only)
- `GET /api/admin/allusers` - List all system profiles.
- `GET /api/admin/registered` - View raw registered users from Supabase.
- `PUT /api/admin/edit/:id` - Update user role or status.
- `DELETE /api/admin/delete/:id` - Remove a user profile.

### Transactions
- `POST /api/user/transaction` - Create a new record (USER/ADMIN).
- `PUT /api/user/transaction/:id` - Edit a record (Owner only protection).
- `GET /api/user/transactions/:id` - Fetch all transactions for a specific user.

### Analytics
- `GET /api/analyzer/allRecords` - System-wide records view with creator names (ANALYST/ADMIN).

---

## Project Structure

- `src/index.js` — Server entry point & DB initialization.
- `src/routes/` — Express route definitions.
- `src/controllers/` — Request handling logic.
- `src/models/` — Raw SQL queries and database services.
- `src/middleware/` — Auth/RBAC and error handling.
- `src/config/` — DB connection pool and environment loading.

---

##  Maintenance

To update the database schema, modify the files in `src/data/` and restart the server; the `CREATE TABLE IF NOT EXISTS` logic will ensure the schema stays up to date without data loss.
