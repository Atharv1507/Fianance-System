import './StatCard.css'

function StatCard({ title, value, accentClass = '' }) {
  return (
    <div className={`stat-card ${accentClass}`}>
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">{value}</h3>
    </div>
  )
}

export default StatCard
