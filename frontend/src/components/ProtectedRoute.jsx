import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Loader from './Loader'
//eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const ProtectedRoute = ({ children, adminOnly = false, requiredPermission = null }) => {
  const requiredRole = adminOnly ? 'admin' : null
  const { isAuthenticated, user, isLoading, hasPermission } = useAuthStore()
  const location = useLocation()

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader text="Checking authentication..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // Check role-based access — redirect immediately, no dual-render
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
