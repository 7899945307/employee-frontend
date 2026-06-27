import { useCallback, useEffect, useState } from 'react'
import './App.css'

const apiBaseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
  : import.meta.env.VITE_API_BASE_URL ?? ''

const emptyForm = {
  name: '',
  role: '',
  department: '',
  email: '',
  location: '',
}

function App() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const apiUrl = `${apiBaseUrl}/api/employees`

  const loadEmployees = useCallback(async (signal, showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true)
      }
      setError('')
      const response = await fetch(apiUrl, { signal })

      if (!response.ok) {
        throw new Error('Failed to load employee data.')
      }

      const data = await response.json()
      setEmployees(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Unable to fetch employees from the backend.')
      }
    } finally {
      setLoading(false)
    }
  }, [apiUrl])

  useEffect(() => {
    const controller = new AbortController()

    async function loadInitialEmployees() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Failed to load employee data.')
        }

        const data = await response.json()
        setEmployees(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Unable to fetch employees from the backend.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadInitialEmployees()

    return () => controller.abort()
  }, [apiUrl])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `${apiUrl}/${editingId}` : apiUrl

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to save employee.')
      }

      setSuccess(editingId ? 'Employee updated successfully.' : 'Employee added successfully.')
      resetForm()
      await loadEmployees()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(employee) {
    setEditingId(employee.id)
    setForm({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      email: employee.email,
      location: employee.location,
    })
    setSuccess('')
    setError('')
  }

  async function handleDelete(employeeId) {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${apiUrl}/${employeeId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to delete employee.')
      }

      if (editingId === employeeId) {
        resetForm()
      }

      setSuccess('Employee deleted successfully.')
      await loadEmployees()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <p className="eyebrow">Employee Directory</p>
        <h1>Manage employees with your Python and Postgres backend</h1>
        <p className="hero-copy">
          This React app uses <code>GET</code>, <code>POST</code>, <code>PUT</code>,
          and <code>DELETE</code> requests against <code>/api/employees</code>.
        </p>
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>{editingId ? 'Edit employee' : 'Add employee'}</h2>
            <p>Use the form below to create or update employee records.</p>
          </div>

          <form className="employee-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Role
              <input name="role" value={form.role} onChange={handleChange} required />
            </label>
            <label>
              Department
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update employee' : 'Add employee'}
              </button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading row-heading">
            <div>
              <h2>Employees</h2>
              <p>Refresh, edit, or delete employees stored in Postgres.</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => loadEmployees()}>
              Refresh
            </button>
          </div>

          {loading && <p className="status-message">Loading employees...</p>}
          {error && <p className="status-message error-message">{error}</p>}
          {success && <p className="status-message success-message">{success}</p>}

          {!loading && !error && (
            <section className="employee-grid">
              {employees.map((employee) => (
                <article key={employee.id} className="employee-card">
                  <div className="card-header">
                    <div>
                      <h2>{employee.name}</h2>
                      <span>{employee.department}</span>
                    </div>
                    <div className="card-actions">
                      <button type="button" className="secondary-button" onClick={() => handleEdit(employee)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(employee.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <dl className="employee-details">
                    <div>
                      <dt>Role</dt>
                      <dd>{employee.role}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{employee.email}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{employee.location}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </section>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
