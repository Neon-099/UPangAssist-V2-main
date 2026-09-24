import { useState} from 'react'
import upangLogo from '../../assets/upang logo.png'
import { apiRequest } from '../../services/apiClient'

function LoginPage({ onLogin, onSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      onLogin(data.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="University campus">
        <div className="login-visual-overlay"></div>
        <div className="login-visual-copy">
          <div className="visual-emblem-badge">
            <img
              src={upangLogo}
              alt="PHINMA UPang Logo"
              className="visual-logo-img"
            />
          </div>
          <span>PHINMA</span>
          <strong>University of Pangasinan</strong>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-content">
          <p className="login-kicker">WELCOME!</p>
          <h1>
            To <span>Upang Assist</span>
          </h1>
          <h2>Log In</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">School Email Address:</label>

            <div className="input-with-icon">
              <input
                id="login-email"
                type="email"
                placeholder="student@your-school-domain.edu.ph"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <label htmlFor="login-password">Password:</label>

            <div className="input-with-icon">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          <p className="login-footer">
            Do not have an account?{' '}
            <button type="button" onClick={onSignUp}>
              Sign Up
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage