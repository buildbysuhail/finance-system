import { NavLink } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/categories', label: 'Categories' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`fixed left-0 top-0 w-60 h-screen bg-gray-900 text-white flex flex-col overflow-y-auto transition-transform duration-300 z-40 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-lg font-bold tracking-wide">FinanceApp</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
