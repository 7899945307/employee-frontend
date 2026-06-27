import { useEffect, useState } from 'react'
import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

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
        // #region debug-point B:fetch-start
        fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'ui-not-working', runId: 'pre-fix', hypothesisId: 'B', location: 'frontend/src/App.jsx:loadEmployees:start', msg: '[DEBUG] employee fetch starting', data: { apiBaseUrl }, ts: Date.now() }) }).catch(() => {})
        // #endregion

        const response = await fetch(`${apiBaseUrl}/api/employees`, {
          signal: controller.signal,
        })
        // #region debug-point C:fetch-response
        fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'ui-not-working', runId: 'pre-fix', hypothesisId: 'C', location: 'frontend/src/App.jsx:loadEmployees:response', msg: '[DEBUG] employee fetch response received', data: { ok: response.ok, status: response.status, statusText: response.statusText }, ts: Date.now() }) }).catch(() => {})
        // #endregion

        if (!response.ok) {
          throw new Error('Failed to load employee data.')
        }

        const data = await response.json()
        // #region debug-point D:fetch-success
        fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'ui-not-working', runId: 'pre-fix', hypothesisId: 'D', location: 'frontend/src/App.jsx:loadEmployees:success', msg: '[DEBUG] employee fetch parsed successfully', data: { count: Array.isArray(data) ? data.length : -1 }, ts: Date.now() }) }).catch(() => {})
        // #endregion
        setEmployees(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          // #region debug-point E:fetch-error
          fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'ui-not-working', runId: 'pre-fix', hypothesisId: 'E', location: 'frontend/src/App.jsx:loadEmployees:catch', msg: '[DEBUG] employee fetch failed', data: { name: err.name, message: err.message }, ts: Date.now() }) }).catch(() => {})
          // #endregion
          setError('Unable to fetch employees from the backend.')
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
