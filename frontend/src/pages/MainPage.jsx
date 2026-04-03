import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'

export default function MainPage() {
  const { userData, user, role } = useContext(UserContext)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  useEffect(() => {

  }, [])
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
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
                <p className="text-gray-600 text-sm mb-4">Add, view, and delete users from the system.</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">View Users &rarr;</button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Users</h3>
                <p className="text-gray-600 text-sm mb-4">Modify existing user roles and active status.</p>
                <button className="text-green-600 text-sm font-medium hover:underline">Edit Users &rarr;</button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">View Records</h3>
                <p className="text-gray-600 text-sm mb-4">Access system audit logs and financial records.</p>
                <button className="text-purple-600 text-sm font-medium hover:underline">View Records &rarr;</button>
              </div>

            </div>
          </div>
        )}

        {/* ANALYST VIEW */}
        {role === 'ANALYST' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">Analyst Workspace</h3>
            <p className="text-gray-600">You have access to view and analyze records, but cannot modify users.</p>
            {/* Example mock content */}
            <div className="mt-4 h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              [Analytical Charts Placeholder]
            </div>
          </div>
        )}

        {/* USER VIEW */}
        {role === 'USER' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">My Account</h3>
            <p className="text-gray-600">Welcome to your personal dashboard. You have standard access.</p>
            <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
              No new notifications.
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
