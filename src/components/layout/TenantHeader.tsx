// src/components/layout/TenantHeader.tsx
import React from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useAuth } from '@/contexts/AuthContext'
import { Stethoscope } from 'lucide-react'

const TenantHeader: React.FC = () => {
  const { tenantName, tenantLogoURL, subscription, loading: tenantLoading } = useTenant()
  const { user } = useAuth()

  // Wait until tenant data is loaded
  if (tenantLoading) return null

  // Hide header for platform super_admins
  if (user?.role === 'super_admin') {
    return null
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="flex items-center space-x-3">
        {tenantLogoURL ? (
          <img
            src={tenantLogoURL}
            alt={tenantName}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold">{tenantName}</h1>
          <p className="text-xs text-blue-100">
            {subscription.plan} Plan • Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span className="text-xs bg-blue-500 bg-opacity-50 px-2 py-1 rounded">
        {subscription.status.toUpperCase()}
      </span>
    </div>
  )
}

export default TenantHeader
