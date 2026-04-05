import { useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const MyTransactions = forwardRef(function MyTransactions(props, ref) {
  const { user } = useContext(UserContext)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState('ALL')

  const fetchTransactions = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/transactions/${user.id}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` }
      })
      setRecords(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user?.id])

  const totalIncome = records.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const totalExpense = records.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const netBalance = totalIncome - totalExpense

  const filtered = records.filter(r => filterType === 'ALL' || r.type === filterType)
  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 })

  // Expose refresh for parent via ref
  useImperativeHandle(ref, () => ({
    refresh: fetchTransactions
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Income</p>
                <p className="text-lg font-bold text-green-600">₹{fmt(totalIncome)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expenses</p>
                <p className="text-lg font-bold text-red-600">₹{fmt(totalExpense)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${netBalance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>₹{fmt(netBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Transactions</h3>
              <p className="text-sm text-gray-500 mt-0.5">{records.length} records</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="ALL">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <button
                onClick={fetchTransactions}
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
            <p className="text-sm text-gray-500">Loading transactions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-sm font-medium">{records.length === 0 ? 'No transactions yet' : 'No matching transactions'}</p>
            {records.length === 0 && <p className="text-xs text-gray-400">Create your first transaction to get started</p>}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((record) => (
              <div key={record.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    record.type === 'INCOME'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {record.type === 'INCOME' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{record.category}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(record.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {record.notes && <span className="ml-2 text-gray-400">· {record.notes}</span>}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-sm whitespace-nowrap ${
                  record.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {record.type === 'INCOME' ? '+' : '-'}₹{fmt(parseFloat(record.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default MyTransactions
