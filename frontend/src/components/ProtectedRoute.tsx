import { Navigate, Outlet } from 'react-router-dom'
import AdminLayout from './AdminLayout'

export default function ProtectedRoute() {
  const token = localStorage.getItem('admin_token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
