import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024
      setIsLargeScreen(isLarge)
      if (isLarge) {
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-open sidebar on large screens
  useEffect(() => {
    if (isLargeScreen) {
      setSidebarOpen(true)
    }
  }, [isLargeScreen])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={`flex-1 transition-all duration-300 h-screen overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 z-40 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
