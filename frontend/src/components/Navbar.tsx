import { Activity, Inbox, LogOut, Settings } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-[13px] transition-colors ${
      isActive
        ? 'bg-surface-elevated text-text-primary border-l-2 border-accent'
        : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full text-[11px] ${
      isActive ? 'text-accent' : 'text-text-secondary'
    }`

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 bg-surface border-r border-border flex-col z-40">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" strokeWidth="1.5" stroke="#ececf0">
              <path d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l2-2h14l2 2" />
              <path d="M9 13l2 2 4-4" stroke="#d4a574" />
            </svg>
          </div>
          <span className="text-text-primary font-semibold">FrontDesk</span>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          <NavLink to="/inbox" className={linkClass}>
            Inbox
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
          <NavLink to="/activity-log" className={linkClass}>
            Activity Log
          </NavLink>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-[13px] text-text-primary">{user?.fullName}</div>
          <div className="text-[11px] text-text-secondary mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-error transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around z-40">
        <NavLink to="/inbox" className={mobileLinkClass}>
          <Inbox size={18} strokeWidth={1.5} />
          <span>Inbox</span>
        </NavLink>
        <NavLink to="/settings" className={mobileLinkClass}>
          <Settings size={18} strokeWidth={1.5} />
          <span>Settings</span>
        </NavLink>
        <NavLink to="/activity-log" className={mobileLinkClass}>
          <Activity size={18} strokeWidth={1.5} />
          <span>Activity</span>
        </NavLink>
      </nav>
    </>
  )
}