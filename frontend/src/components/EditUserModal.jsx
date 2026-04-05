import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const ROLES = ['ADMIN', 'ANALYST', 'USER']
const STATUSES = ['ACTIVE', 'INACTIVE']

export default function EditUserModal({ isOpen, onClose }) {
  const { user } = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', role: '', status: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Fetch all users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers()
      setSelectedUser(null)
      setFormData({ name: '', role: '', status: '' })
      setFeedback({ type: '', message: '' })
    }
  }, [isOpen])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/allusers`, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      })
      setUsers(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setFeedback({ type: 'error', message: 'Failed to fetch users.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    setFormData({ name: u.name || '', role: u.role || 'USER', status: u.status || 'INACTIVE' })
    setFeedback({ type: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if (!selectedUser) return
    setSaving(true)
    setFeedback({ type: '', message: '' })
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/edit/${selectedUser.id}`,
        { name: formData.name, role: formData.role, status: formData.status },
        { headers: { Authorization: `Bearer ${user?.access_token}` } }
      )
      setFeedback({ type: 'success', message: `${formData.name} updated successfully!` })
      // Refresh the users list to reflect changes
      await fetchUsers()
      // Update selectedUser with new data
      setSelectedUser((prev) => ({ ...prev, ...formData }))
    } catch (err) {
      console.error('Failed to update user:', err)
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to update user.' })
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    setSelectedUser(null)
    setFormData({ name: '', role: '', status: '' })
    setFeedback({ type: '', message: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-modal-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedUser && (
                <button
                  onClick={handleBack}
                  className="text-white/80 hover:text-white transition p-1 -ml-1"
                  title="Back to user list"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedUser ? 'Edit User' : 'Select a User to Edit'}
                </h2>
                <p className="text-green-100 text-sm mt-0.5">
                  {selectedUser ? selectedUser.id?.slice(0, 8) + '...' : `${users.length} users found`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">

          {/* Feedback banner */}
          {feedback.message && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {feedback.type === 'success' ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {feedback.message}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading users...</p>
            </div>
          )}

          {/* USER LIST VIEW */}
          {!loading && !selectedUser && (
            <div className="space-y-2">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users found.</p>
              ) : (
                users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {(u.name || u.id)?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{u.name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{u.id?.slice(0, 20)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'ANALYST' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {u.role}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500' :
                        u.status === 'SUSPENDED' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`} />
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* EDIT FORM VIEW */}
          {!loading && selectedUser && (
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${formData.role === r
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${formData.status === s
                        ? s === 'ACTIVE'
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-gray-600 text-white border-gray-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — save button only when editing */}
        {!loading && selectedUser && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
