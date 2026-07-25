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
    `flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-[#222228] text-[#f0f0f4] border-l-2 border-[#7c6af7]'
        : 'text-[#8b8b9e] hover:bg-[#222228] hover:text-[#f0f0f4]'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs ${
      isActive ? 'text-[#7c6af7]' : 'text-[#8b8b9e]'
    }`

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 bg-[#1a1a1f] border-r border-[#2e2e36] flex-col z-40">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7c6af7] flex items-center justify-center text-white font-bold text-sm">
            FD
          </div>
          <span className="text-[#f0f0f4] font-semibold">FrontDesk</span>
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

        <div className="p-4 border-t border-[#2e2e36]">
          <div className="text-sm text-[#f0f0f4]">{user?.fullName}</div>
          <div className="text-xs text-[#8b8b9e] mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#8b8b9e] hover:text-[#f87171] transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1a1a1f] border-t border-[#2e2e36] flex items-center justify-around z-40">
        <NavLink to="/inbox" className={mobileLinkClass}>
          <span>📥</span>
          <span>Inbox</span>
        </NavLink>
        <NavLink to="/settings" className={mobileLinkClass}>
          <span>⚙</span>
          <span>Settings</span>
        </NavLink>
        <NavLink to="/activity-log" className={mobileLinkClass}>
          <span>📋</span>
          <span>Activity</span>
        </NavLink>
      </nav>
    </>
  )
}