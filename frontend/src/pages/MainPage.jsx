import { useEffect, useState, useContext, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { UserContext } from '../context/UserContext'
import EditUserModal from '../components/EditUserModal'
import AnalyticsPanel from '../components/AnalyticsPanel'
import CreateTransactionModal from '../components/CreateTransactionModal'
import MyTransactions from '../components/MyTransactions'

export default function MainPage() {
  const { userData, user, role, status } = useContext(UserContext)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [txnModalOpen, setTxnModalOpen] = useState(false)
  const [AnalyticsModal, setAnalyticsModal] = useState(false)
  const txnListRef = useRef(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-800">Finance App</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                Role: {role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h2>
          <p className="text-gray-600 mt-1">Here is your {role.toLowerCase()} dashboard.</p>
        </div>

        {/* ADMIN VIEW */}
        {role === 'ADMIN' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Users</h3>
                <p className="text-gray-600 text-sm mb-4">Modify existing user roles and active status.</p>
                <button onClick={() => setEditModalOpen(true)} className="text-green-600 text-sm font-medium hover:underline">Edit Users &rarr;</button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{AnalyticsModal ? "Hide Records" : "View Records"}</h3>
                < p className="text-gray-600 text-sm mb-4">Access system audit logs and financial records.</p>
                <button onClick={() => { setAnalyticsModal(!AnalyticsModal) }} className="text-purple-600 text-sm font-medium hover:underline">{AnalyticsModal ? "Hide Records" : "View Records"} &rarr;</button>
              </div>

            </div>
          </div>
        )}

        {/* ANALYST VIEW */}
        {(role === 'ANALYST' || (role === 'ADMIN' && AnalyticsModal)) && <AnalyticsPanel />}

        {/* USER VIEW */}
        {role === 'USER' && status === 'INACTIVE' && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Inactive</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your account is currently inactive. Please contact an administrator to activate your account and gain access to the dashboard.
              </p>
              <div className="mt-6 px-4 py-3 bg-orange-50 rounded-xl">
                <p className="text-xs text-orange-700 font-medium">
                  📧 Reach out to your system administrator for assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        {role === 'USER' && status === 'ACTIVE' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Finances</h3>
                <p className="text-sm text-gray-500">Track your income and expenses</p>
              </div>
              <button
                onClick={() => setTxnModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Transaction
              </button>
            </div>
            <MyTransactions ref={txnListRef} />
          </div>
        )}

      </main>

      {/* Edit User Modal */}
      <EditUserModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />

      {/* Create Transaction Modal */}
      <CreateTransactionModal
        isOpen={txnModalOpen}
        onClose={() => setTxnModalOpen(false)}
        onCreated={() => {
          if (txnListRef.current?.refresh) txnListRef.current.refresh()
        }}
      />
    </div>
  )
}
