import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Badge from './Badge'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">Zorvyn Finance</div>
      <nav className="navbar-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/records">Records</NavLink>
        {user?.role === 'ADMIN' && <NavLink to="/users">Users</NavLink>}
      </nav>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <Badge type={user?.role}>{user?.role}</Badge>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
