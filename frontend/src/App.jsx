import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState(
    localStorage.getItem('employeeUser') ? 'dashboard' : 'login'
  )

  const go = (nextPage) => setPage(nextPage)

  if (page === 'signup') {
    return <Signup go={go} />
  }

  if (page === 'dashboard') {
    return <Dashboard go={go} />
  }

  return <Login go={go} />
}
