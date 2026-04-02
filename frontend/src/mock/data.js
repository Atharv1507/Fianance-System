export const mockUser = { id: '1', name: 'Atharv Aggarwal', email: 'admin@demo.com', role: 'ADMIN' }
// role can be switched to 'VIEWER' or 'ANALYST' to test different views

export const mockRecords = [
  { id: '1', amount: 50000, type: 'INCOME', category: 'Salary', date: '2026-03-31', notes: 'March salary' },
  { id: '2', amount: 15000, type: 'EXPENSE', category: 'Rent', date: '2026-03-30', notes: 'Monthly rent' },
  { id: '3', amount: 2500, type: 'EXPENSE', category: 'Food', date: '2026-03-28', notes: null },
  { id: '4', amount: 30000, type: 'INCOME', category: 'Freelance', date: '2026-03-25', notes: 'Client project' },
  { id: '5', amount: 3000, type: 'EXPENSE', category: 'Utilities', date: '2026-03-22', notes: 'Electricity bill' },
  { id: '6', amount: 50000, type: 'INCOME', category: 'Salary', date: '2026-02-28', notes: 'Feb salary' },
  { id: '7', amount: 15000, type: 'EXPENSE', category: 'Rent', date: '2026-02-27', notes: 'Monthly rent' },
  { id: '8', amount: 5000, type: 'EXPENSE', category: 'Travel', date: '2026-02-20', notes: 'Flight tickets' },
  { id: '9', amount: 50000, type: 'INCOME', category: 'Salary', date: '2026-01-31', notes: 'Jan salary' },
  { id: '10', amount: 15000, type: 'EXPENSE', category: 'Rent', date: '2026-01-30', notes: 'Monthly rent' },
]

export const mockSummary = {
  total_income: 180000,
  total_expenses: 55500,
  net_balance: 124500,
  record_count: 10,
  income_count: 4,
  expense_count: 6,
}

export const mockCategories = [
  { category: 'Salary', type: 'INCOME', total: 150000, count: 3, percentage: 83.3 },
  { category: 'Freelance', type: 'INCOME', total: 30000, count: 1, percentage: 16.7 },
  { category: 'Rent', type: 'EXPENSE', total: 45000, count: 3, percentage: 81.1 },
  { category: 'Food', type: 'EXPENSE', total: 2500, count: 1, percentage: 4.5 },
  { category: 'Utilities', type: 'EXPENSE', total: 3000, count: 1, percentage: 5.4 },
  { category: 'Travel', type: 'EXPENSE', total: 5000, count: 1, percentage: 9.0 },
]

export const mockMonthlyTrends = [
  { month: '2026-01', income: 50000, expenses: 15000, net: 35000 },
  { month: '2026-02', income: 56000, expenses: 20000, net: 36000 },
  { month: '2026-03', income: 80000, expenses: 20500, net: 59500 },
]

export const mockUsers = [
  { id: '1', name: 'Atharv Aggarwal', email: 'admin@demo.com', role: 'ADMIN', status: 'ACTIVE' },
  { id: '2', name: 'Riya Sharma', email: 'analyst@demo.com', role: 'ANALYST', status: 'ACTIVE' },
  { id: '3', name: 'Karan Mehta', email: 'viewer@demo.com', role: 'VIEWER', status: 'ACTIVE' },
]
