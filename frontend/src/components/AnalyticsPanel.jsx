import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

export default function AnalyticsPanel() {
  const { user } = useContext(UserContext)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/analyzer/allRecords`, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      })
      setRecords(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const totalIncome = records.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const totalExpense = records.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const netBalance = totalIncome - totalExpense

  const filteredRecords = records.filter(r => {
    const matchesType = filterType === 'ALL' || r.type === filterType
    const matchesSearch = searchTerm === '' ||
      (r.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.created_by_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Income</p>
                <p className="text-xl font-bold text-green-600">₹{fmt(totalIncome)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Expense</p>
                <p className="text-xl font-bold text-red-600">₹{fmt(totalExpense)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Net Balance</p>
                <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₹{fmt(netBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Records</h3>
              <p className="text-sm text-gray-500 mt-0.5">{records.length} total records</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search category or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <button
                onClick={fetchRecords}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-sm font-medium">No financial records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {(record.created_by_name || '?')[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{record.created_by_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                      {new Date(record.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-gray-900">{record.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        record.type === 'INCOME'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          record.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {record.type}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right font-semibold whitespace-nowrap ${
                      record.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === 'INCOME' ? '+' : '-'}₹{fmt(parseFloat(record.amount))}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">
                      {record.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
