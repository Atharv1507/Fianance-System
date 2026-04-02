import { useState } from 'react'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import { mockUsers } from '../mock/data'
import './Users.css'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'VIEWER',
}

function Users() {
  // TODO: replace with API call
  const [users, setUsers] = useState(mockUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const newUser = {
      id: String(Date.now()),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: 'ACTIVE',
    }
    setUsers((prev) => [...prev, newUser])
    setForm(emptyForm)
    setIsModalOpen(false)
  }

  const onRoleChange = (userId, role) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))
  }

  const onToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : user,
      ),
    )
  }

  const onDelete = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  return (
    <div className="users-page">
      <Navbar />
      <main className="users-main">
        <section className="users-toolbar">
          <h1>Users</h1>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            Add User
          </button>
        </section>

        <section className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge type={user.role}>{user.role}</Badge>
                  </td>
                  <td>
                    <Badge type={user.status}>{user.status}</Badge>
                  </td>
                  <td className="users-actions">
                    <select value={user.role} onChange={(event) => onRoleChange(user.id, event.target.value)}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                    <button type="button" onClick={() => onToggleStatus(user.id)}>
                      Toggle Status
                    </button>
                    <button type="button" onClick={() => onDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Modal title="Add User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="users-form" onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />

          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={form.role} onChange={onChange} required>
            <option value="ADMIN">ADMIN</option>
            <option value="ANALYST">ANALYST</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <button type="submit">Create User</button>
        </form>
      </Modal>
    </div>
  )
}

export default Users
