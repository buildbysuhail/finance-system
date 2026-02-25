import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { ConfirmModal } from '../ui/ConfirmModal'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/categories', label: 'Categories' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [logoutPopup, setLogoutPopup] = useState(false)
  const { user, logout } = useAuth()
// console.log(isOpen, "isOpeeen")
  return (
    <aside
      className={`relative shrink-0 bg-gray-900 text-white flex flex-col h-screen transition-all duration-300 ${
        isOpen ? 'w-60' : 'w-14'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-5 border-b border-gray-700 overflow-hidden">
        {isOpen && (
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-wide truncate">FinanceApp</h1>
            <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors whitespace-nowrap overflow-hidden ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <span className={`transition-all duration-300 ${isOpen ? '' : 'mx-auto'}`} title={`${!isOpen ? item.label : ''}`}>
              {item.label.charAt(0)}
            </span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-gray-700 overflow-hidden">
        {isOpen ? (
          <button
            onClick={()=>setLogoutPopup(true)}
            className="text-sm text-gray-400 hover:text-white transition-colors px-2"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={()=>setLogoutPopup(true)}
            className="w-full flex justify-center text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <span className="text-xs">↩</span>
          </button>
        )}
      </div>
      
      <ConfirmModal
        isOpen={logoutPopup}
        title="Logout the user"
        message="Are you sure you want to logout this account? This action cannot be undone."
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={logout}
        onCancel={() => {
          setLogoutPopup(false);
          // setDeleteId(null);
        }}
      />
    </aside>
  )
}