import { useEffect, useState } from 'react'
import './App.css'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '')

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadEmployees() {
      try {
        setLoading(true)
        setError('')

        if (!apiBaseUrl) {
          throw new Error('Missing VITE_API_BASE_URL')
        }

        const response = await fetch(`${apiBaseUrl}/api/employees`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to load employee data.')
        }

        const data = await response.json()
        setEmployees(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(
            err.message === 'Missing VITE_API_BASE_URL'
              ? 'Set VITE_API_BASE_URL to your deployed backend URL.'
              : 'Unable to fetch employees from the backend.',
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()

    return () => controller.abort()
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-section">
        <p className="eyebrow">Employee Directory</p>
        <h1>Employees fetched from your Python backend API</h1>
        <p className="hero-copy">
          This React app calls <code>/api/employees</code> and shows the list returned
          by the Python backend server.
        </p>
      </section>

      {loading && <p className="status-message">Loading employees...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <section className="employee-grid">
          {employees.map((employee) => (
            <article key={employee.id} className="employee-card">
              <div className="card-header">
                <h2>{employee.name}</h2>
                <span>{employee.department}</span>
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
    </main>
  )
}

export default App
