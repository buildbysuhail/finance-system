import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ReportsPage } from './pages/ReportsPage'

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App