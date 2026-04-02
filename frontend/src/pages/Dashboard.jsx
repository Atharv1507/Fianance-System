import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { mockCategories, mockMonthlyTrends, mockRecords, mockSummary } from '../mock/data'
import './Dashboard.css'

const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`

function Dashboard() {
  const { user } = useAuth()
  const canSeeAnalytics = user?.role === 'ADMIN' || user?.role === 'ANALYST'
  // TODO: replace with API call
  const recentRecords = [...mockRecords].slice(0, 5)

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        <section className="dashboard-stats">
          {/* TODO: replace with API call */}
          <StatCard title="Total Income" value={formatCurrency(mockSummary.total_income)} accentClass="stat-income" />
          {/* TODO: replace with API call */}
          <StatCard
            title="Total Expenses"
            value={formatCurrency(mockSummary.total_expenses)}
            accentClass="stat-expense"
          />
          {/* TODO: replace with API call */}
          <StatCard title="Net Balance" value={formatCurrency(mockSummary.net_balance)} accentClass="stat-balance" />
          {/* TODO: replace with API call */}
          <StatCard title="Total Records" value={mockSummary.record_count} />
        </section>

        <section className="dashboard-panel">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.category}</td>
                  <td>{record.type}</td>
                  <td>{formatCurrency(record.amount)}</td>
                  <td>{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {canSeeAnalytics && (
          <section className="dashboard-charts">
            <article className="dashboard-panel">
              <h2>Category Breakdown</h2>
              <div className="chart-wrap">
                {/* TODO: replace with API call */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="dashboard-panel">
              <h2>Monthly Trends</h2>
              <div className="chart-wrap">
                {/* TODO: replace with API call */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockMonthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="net" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  )
}

export default Dashboard
