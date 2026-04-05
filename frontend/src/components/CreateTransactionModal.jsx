import { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const TYPES = ['INCOME', 'EXPENSE']
const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other']

export default function CreateTransactionModal({ isOpen, onClose, onCreated }) {
  const { user } = useContext(UserContext)
  const [formData, setFormData] = useState({
    amount: '',
    type: 'INCOME',
    category: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category) {
      setFeedback({ type: 'error', message: 'Amount and category are required.' })
      return
    }
    if (parseFloat(formData.amount) <= 0) {
      setFeedback({ type: 'error', message: 'Amount must be greater than 0.' })
      return
    }

    setSaving(true)
    setFeedback({ type: '', message: '' })
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/transaction`,
        {
          id: user?.id,
          amount: parseFloat(formData.amount),
          type: formData.type,
          category: formData.category,
          notes: formData.notes || null
        },
        { headers: { Authorization: `Bearer ${user?.access_token}` } }
      )
      setFeedback({ type: 'success', message: 'Transaction created successfully!' })
      setFormData({ amount: '', type: 'INCOME', category: '', notes: '' })
      if (onCreated) onCreated()
    } catch (err) {
      console.error('Failed to create transaction:', err)
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to create transaction.' })
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setFormData({ amount: '', type: 'INCOME', category: '', notes: '' })
    setFeedback({ type: '', message: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-modal-in">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">New Transaction</h2>
              <p className="text-blue-100 text-sm mt-0.5">Record a new income or expense</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Feedback */}
          {feedback.message && (
            <div className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${feedback.type === 'success'
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

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition border flex items-center justify-center gap-2 ${formData.type === t
                    ? t === 'INCOME'
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {t === 'INCOME' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                  )}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Transaction'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
