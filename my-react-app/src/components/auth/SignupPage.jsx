import { useState} from 'react'
import upangLogo from '../../assets/upang logo.png'
import { apiRequest } from '../../services/apiClient'

function SignupPage({ onBack, onRegistered }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      onRegistered(data.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page signup-page">
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
        <button
          className="login-back-btn"
          type="button"
          onClick={onBack}
        >
          <span className="back-arrow">←</span>
          <span>Back to Login</span>
        </button>

        <div className="login-content signup-content">
          <h2>Create Student Account</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full Name:</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Juan Dela Cruz"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
            />

            <label htmlFor="signup-email">School Email Address:</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="student@your-school-domain.edu.ph"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="signup-course">Course:</label>
            <input
              id="signup-course"
              name="course"
              type="text"
              placeholder="BS Information Technology"
              value={form.course}
              onChange={handleChange}
              required
              maxLength={150}
            />

            <label htmlFor="signup-password">Password:</label>
            <div className="input-with-icon">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={128}
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

            <label htmlFor="signup-confirm-password">
              Confirm Password:
            </label>

            <div className="input-with-icon">
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={128}
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="login-submit signup-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default SignupPage;