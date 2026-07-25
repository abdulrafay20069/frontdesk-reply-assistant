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
      const res = await client.post('/api/auth/login', { email, password })
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
      <div className="relative flex min-h-screen items-center justify-center bg-[#0f0f11] overflow-hidden">
        {/* Blob top-right */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 animate-blob"
          style={{
            background: 'radial-gradient(circle, #7c6af7 0%, transparent 70%)',
          }}
        />
        {/* Blob bottom-left */}
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 animate-blob animation-delay-5000"
          style={{
            background: 'radial-gradient(circle, #7c6af7 0%, transparent 70%)',
          }}
        />

        {/* Card */}
        <div className="relative w-full max-w-[400px] mx-4">
          <div className="bg-[#1a1a1f] border border-[#2e2e36] rounded-2xl p-8 shadow-xl">
            {/* Monogram */}
            <div className="text-center mb-6">
              <span className="text-3xl font-semibold text-[#7c6af7]">FD</span>
            </div>

            {/* Title */}
            <h1 className="text-center text-2xl font-semibold text-[#f0f0f4]">FrontDesk</h1>
            <p className="text-center text-sm text-[#8b8b9e] mt-1 mb-8">
              AI-assisted replies for your front desk.
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
                  className="w-full px-4 py-2.5 bg-[#222228] border border-[#2e2e36] rounded-lg text-[#f0f0f4] text-sm placeholder-[#55555f] focus:outline-none focus:ring-2 focus:ring-[#7c6af7] focus:border-transparent transition-shadow"
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
                  className="w-full px-4 py-2.5 bg-[#222228] border border-[#2e2e36] rounded-lg text-[#f0f0f4] text-sm placeholder-[#55555f] focus:outline-none focus:ring-2 focus:ring-[#7c6af7] focus:border-transparent transition-shadow"
                />
              </div>

              {error && (
                <p className="text-sm text-[#f87171]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#7c6af7] hover:bg-[#9585f8] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
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
