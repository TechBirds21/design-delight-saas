// src/components/routes/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredModule: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredModule }) => {
  const { loading: authLoading, isAuthenticated } = useAuth()
  const { loading: tenantLoading, hasModuleAccess } = useTenant()

  // Show a full-screen loader until both Auth and Tenant contexts are ready
  if (authLoading || tenantLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  // Not logged in → go to role selection
  if (!isAuthenticated) {
    return <Navigate to="/select-role" replace />
  }

  // Tenant or role doesn't allow this module → unauthorized
  if (!hasModuleAccess(requiredModule)) {
    return <Navigate to="/unauthorized" replace />
  }

  // All good → render the protected page
  return <>{children}</>
}

export default ProtectedRoute
