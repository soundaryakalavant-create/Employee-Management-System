import { useEffect, useMemo, useState } from 'react'
import {
  Bell, ChevronDown, LayoutDashboard, Users, UserPlus, Settings,
  FileText, LogOut, Search, Plus, Pencil, Trash2, X, Menu, CalendarDays
} from 'lucide-react'
import api from '../api'

const emptyEmployee = {
  code: '',
  employeeName: '',
  dateOfBirth: '',
  emailAddress: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  phoneNumber: '',
  emergencyNumber: '',
  panNumber: '',
  taxStatus: 'Regular',
  gender: 'Female'
}

export default function Dashboard({ go }) {
  const [employees, setEmployees] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [form, setForm] = useState(emptyEmployee)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const user = JSON.parse(localStorage.getItem('employeeUser') || '{}')

  const loadEmployees = async () => {
    try {
      const res = await api.get('/employees')
      setEmployees(res.data)
    } catch {
      setError('Cannot connect to backend. Make sure Spring Boot is running.')
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const filteredEmployees = useMemo(() => {
    const value = search.toLowerCase()
    return employees.filter(e =>
      [e.code, e.employeeName, e.emailAddress, e.phoneNumber, e.city]
        .some(x => String(x || '').toLowerCase().includes(value))
    )
  }, [employees, search])

  const openAdd = () => {
    setEditingCode(null)
    setForm(emptyEmployee)
    setError('')
    setModalOpen(true)
  }

  const openEdit = async (code) => {
    try {
      const res = await api.get(`/employees/${code}`)
      setEditingCode(code)
      setForm({
        ...emptyEmployee,
        ...res.data,
        dateOfBirth: res.data.dateOfBirth || ''
      })
      setError('')
      setModalOpen(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load employee')
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCode(null)
    setForm(emptyEmployee)
  }

  const saveEmployee = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingCode) {
        await api.put(`/employees/${editingCode}`, form)
      } else {
        await api.post('/employees', form)
      }
      await loadEmployees()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save employee')
    }
  }

  const deleteEmployee = async (code) => {
    if (!window.confirm(`Delete employee ${code}?`)) return
    try {
      await api.delete(`/employees/${code}`)
      loadEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete employee')
    }
  }

  const logout = () => {
    localStorage.removeItem('employeeUser')
    go('login')
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${mobileMenu ? 'show' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-square">E</div>
          <div><strong>Employee</strong><span>Management</span></div>
        </div>

        <div className="menu-label">MAIN MENU</div>
        <nav>
          <button className="side-item active"><LayoutDashboard size={18}/> Dashboard</button>
          <button className="side-item"><Users size={18}/> Employees</button>
          <button className="side-item"><UserPlus size={18}/> Recruitment</button>
          <button className="side-item"><FileText size={18}/> Reports</button>
          <button className="side-item"><CalendarDays size={18}/> Leave</button>
        </nav>

        <div className="menu-label">SYSTEM</div>
        <nav>
          <button className="side-item"><Settings size={18}/> Settings</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">{(user.name || 'U').charAt(0).toUpperCase()}</div>
            <div><strong>{user.name || 'User'}</strong><span>Administrator</span></div>
          </div>
          <button className="side-item logout" onClick={logout}><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}><Menu/></button>
          <div>
            <h1>Employee Management</h1>
            <p>Manage your employees and their information</p>
          </div>
          <div className="top-actions">
            <button className="notification"><Bell size={19}/><i></i></button>
            <div className="user-menu">
              <div className="avatar">{(user.name || 'U').charAt(0).toUpperCase()}</div>
              <div><strong>{user.name || 'User'}</strong><span>Admin</span></div>
              <ChevronDown size={16}/>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon purple"><Users/></div>
              <div><span>Total Employees</span><strong>{employees.length}</strong><small>All employees</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><UserPlus/></div>
              <div><span>Active Employees</span><strong>{employees.length}</strong><small>Currently active</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><CalendarDays/></div>
              <div><span>Departments</span><strong>04</strong><small>Across organization</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><FileText/></div>
              <div><span>Records</span><strong>{employees.length}</strong><small>Employee records</small></div>
            </div>
          </div>

          <div className="employee-panel">
            <div className="panel-header">
              <div>
                <h2>Employees</h2>
                <p>View and manage all employee records</p>
              </div>
              <button className="add-btn" onClick={openAdd}><Plus size={18}/> Add New</button>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={18}/>
                <input
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="record-count">{filteredEmployees.length} employees</div>
            </div>

            {error && <div className="error-box dashboard-error">{error}</div>}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-row">
                        <Users size={32}/>
                        <strong>No employees found</strong>
                        <span>Click “Add New” to create an employee record.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map(employee => (
                      <tr key={employee.id}>
                        <td>
                          <button className="employee-id" onClick={() => openEdit(employee.code)}>
                            {employee.code}
                          </button>
                        </td>
                        <td>
                          <div className="employee-cell">
                            <div className="table-avatar">{employee.employeeName?.charAt(0)?.toUpperCase()}</div>
                            <strong>{employee.employeeName}</strong>
                          </div>
                        </td>
                        <td>{employee.emailAddress || '-'}</td>
                        <td>{employee.phoneNumber || '-'}</td>
                        <td>{employee.city || '-'}</td>
                        <td><span className="status active-status">{employee.gender || '-'}</span></td>
                        <td>
                          <div className="actions">
                            <button className="action edit" title="Edit" onClick={() => openEdit(employee.code)}><Pencil size={16}/></button>
                            <button className="action delete" title="Delete" onClick={() => deleteEmployee(employee.code)}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="employee-modal">
            <div className="modal-header">
              <div>
                <h2>{editingCode ? 'Update Employee' : 'Create Employee'}</h2>
                <p>{editingCode ? 'Edit the pre-populated employee details' : 'Enter employee information'}</p>
              </div>
              <button className="close-btn" onClick={closeModal}><X/></button>
            </div>

            <form onSubmit={saveEmployee}>
              <div className="modal-body">
                <div className="section-title">Personal Details</div>
                <div className="form-grid">
                  <Field label="Code *">
                    <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} required disabled={!!editingCode}/>
                  </Field>
                  <Field label="Employee Name *">
                    <input value={form.employeeName} onChange={e => setForm({...form, employeeName: e.target.value})} required/>
                  </Field>
                  <Field label="Date of Birth">
                    <input type="date" value={form.dateOfBirth || ''} onChange={e => setForm({...form, dateOfBirth: e.target.value})}/>
                  </Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option>Female</option><option>Male</option><option>Other</option>
                    </select>
                  </Field>
                  <Field label="Email Address">
                    <input type="email" value={form.emailAddress || ''} onChange={e => setForm({...form, emailAddress: e.target.value})}/>
                  </Field>
                  <Field label="Phone Number">
                    <input value={form.phoneNumber || ''} onChange={e => setForm({...form, phoneNumber: e.target.value})}/>
                  </Field>
                  <Field label="Emergency Number">
                    <input value={form.emergencyNumber || ''} onChange={e => setForm({...form, emergencyNumber: e.target.value})}/>
                  </Field>
                  <Field label="PAN Number">
                    <input value={form.panNumber || ''} onChange={e => setForm({...form, panNumber: e.target.value})}/>
                  </Field>
                  <Field label="Address 1" full>
                    <input value={form.address1 || ''} onChange={e => setForm({...form, address1: e.target.value})}/>
                  </Field>
                  <Field label="Address 2" full>
                    <input value={form.address2 || ''} onChange={e => setForm({...form, address2: e.target.value})}/>
                  </Field>
                  <Field label="City">
                    <input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})}/>
                  </Field>
                  <Field label="State">
                    <select value={form.state || ''} onChange={e => setForm({...form, state: e.target.value})}>
                      <option value="">Select State</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Telangana</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="Tax Status">
                    <select value={form.taxStatus || 'Regular'} onChange={e => setForm({...form, taxStatus: e.target.value})}>
                      <option>Regular</option>
                      <option>Exempt</option>
                      <option>Contract</option>
                    </select>
                  </Field>
                </div>

                {error && <div className="error-box modal-error">{error}</div>}
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="save-btn">{editingCode ? 'Update Employee' : 'Save Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children, full = false }) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}
