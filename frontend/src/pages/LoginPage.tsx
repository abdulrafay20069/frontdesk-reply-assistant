import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await client.post('/auth/login', { email, password })
      const { token, userId, email: userEmail, fullName, role } = res.data
      login({ id: userId, email: userEmail, fullName, role }, token)
      navigate('/inbox', { replace: true })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
        {/* Blob top-right */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 animate-blob"
          style={{
            background: 'radial-gradient(circle, #d4a574 0%, transparent 70%)',
          }}
        />
        {/* Blob bottom-left */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 animate-blob animation-delay-5000"
          style={{
            background: 'radial-gradient(circle, #d4a574 0%, transparent 70%)',
          }}
        />

        {/* Card */}
        <div className="relative w-full max-w-[400px] mx-4">
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
            {/* Monogram */}
            <div className="text-center mb-6">
              <span className="text-3xl font-semibold text-accent">FD</span>
            </div>

            {/* Title */}
            <h1 className="text-center text-2xl font-semibold text-text-primary">FrontDesk</h1>
            <p className="text-center text-[13px] text-text-secondary mt-1 mb-8">
              Reply faster. Sound like yourself.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-text-primary text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
                />
              </div>

              {error && (
                <p className="text-[13px] text-error">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-[13px] font-medium rounded-lg transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
