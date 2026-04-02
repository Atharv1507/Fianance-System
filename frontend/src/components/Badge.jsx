import './Badge.css'

function Badge({ type, children }) {
  return <span className={`badge badge-${type?.toLowerCase()}`}>{children}</span>
}

export default Badge
