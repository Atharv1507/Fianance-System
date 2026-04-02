import { useMemo, useState } from 'react'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { mockRecords } from '../mock/data'
import './Records.css'

const emptyForm = {
  amount: '',
  type: 'EXPENSE',
  category: '',
  date: '',
  notes: '',
}

const formatCurrency = (amount) => `Rs ${Number(amount).toLocaleString()}`

function Records() {
  const { user } = useAuth()
  // TODO: replace with API call
  const [records, setRecords] = useState(mockRecords)
  const [filters, setFilters] = useState({
    type: 'ALL',
    category: '',
    fromDate: '',
    toDate: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const isAdmin = user?.role === 'ADMIN'

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const typeOk = filters.type === 'ALL' || record.type === filters.type
      const categoryOk = record.category.toLowerCase().includes(filters.category.toLowerCase())
      const fromDateOk = !filters.fromDate || record.date >= filters.fromDate
      const toDateOk = !filters.toDate || record.date <= filters.toDate
      return typeOk && categoryOk && fromDateOk && toDateOk
    })
  }, [filters, records])

  const openAddModal = () => {
    setEditingRecordId(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (record) => {
    setEditingRecordId(record.id)
    setForm({
      amount: String(record.amount),
      type: record.type,
      category: record.category,
      date: record.date,
      notes: record.notes || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRecordId(null)
    setForm(emptyForm)
  }

  const onFilterChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const onFormChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const payload = {
      id: editingRecordId || String(Date.now()),
      amount: Number(form.amount),
      type: form.type,
      category: form.category.trim(),
      date: form.date,
      notes: form.notes.trim() || null,
    }

    if (editingRecordId) {
      setRecords((prev) => prev.map((record) => (record.id === editingRecordId ? payload : record)))
    } else {
      setRecords((prev) => [payload, ...prev])
    }
    closeModal()
  }

  const onDelete = (recordId) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId))
  }

  return (
    <div className="records-page">
      <Navbar />
      <main className="records-main">
        <section className="records-toolbar">
          <h1>Records</h1>
          {isAdmin && (
            <button type="button" onClick={openAddModal}>
              Add Record
            </button>
          )}
        </section>

        <section className="records-filters">
          <select name="type" value={filters.type} onChange={onFilterChange}>
            <option value="ALL">ALL</option>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Filter by category"
            value={filters.category}
            onChange={onFilterChange}
          />
          <input type="date" name="fromDate" value={filters.fromDate} onChange={onFilterChange} />
          <input type="date" name="toDate" value={filters.toDate} onChange={onFilterChange} />
        </section>

        <section className="records-table-wrap">
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.category}</td>
                  <td>{record.type}</td>
                  <td>{formatCurrency(record.amount)}</td>
                  <td>{record.notes || '-'}</td>
                  {isAdmin && (
                    <td>
                      <button type="button" onClick={() => openEditModal(record)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onDelete(record.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Modal title={editingRecordId ? 'Edit Record' : 'Add Record'} isOpen={isModalOpen} onClose={closeModal}>
        <form className="records-form" onSubmit={onSubmit}>
          <label htmlFor="amount">Amount</label>
          <input id="amount" name="amount" type="number" min="0" value={form.amount} onChange={onFormChange} required />

          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={form.type} onChange={onFormChange} required>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>

          <label htmlFor="category">Category</label>
          <input id="category" name="category" value={form.category} onChange={onFormChange} required />

          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={onFormChange} required />

          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={onFormChange} rows="3" />

          <button type="submit">{editingRecordId ? 'Update Record' : 'Create Record'}</button>
        </form>
      </Modal>
    </div>
  )
}

export default Records
