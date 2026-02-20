'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Tenant, UserProfile, UserRole } from '@/lib/database.types'

interface TenantContextType {
  // Tenant atual
  tenant: Tenant | null
  isLoading: boolean

  // Perfil do usuário no tenant
  userProfile: UserProfile | null
  userRole: UserRole

  // Helpers
  isAdmin: boolean
  isManager: boolean

  // Ações
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: ReactNode
  initialTenant?: Tenant | null
}

export function TenantProvider({ children, initialTenant = null }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(!initialTenant)

  const userRole = userProfile?.role || 'member'
  const isAdmin = userRole === 'admin'
  const isManager = userRole === 'manager' || isAdmin

  const refreshTenant = async () => {
    setIsLoading(true)
    try {
      // Por enquanto, usa tenant padrão (single-tenant)
      // No futuro, buscar tenant baseado no domínio ou slug
      const response = await fetch('/api/tenant/current')
      if (response.ok) {
        const data = await response.json()
        setTenant(data.tenant)
        setUserProfile(data.profile)
      }
    } catch (error) {
      console.error('Erro ao carregar tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!initialTenant) {
      refreshTenant()
    }
  }, [initialTenant])

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        userProfile,
        userRole,
        isAdmin,
        isManager,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider')
  }
  return context
}

// Hook para verificar permissões
export function usePermissions() {
  const { isAdmin, isManager, userRole } = useTenant()

  return {
    role: userRole,
    isAdmin,
    isManager,
    canEdit: isAdmin,
    canDelete: isAdmin,
    canManageUsers: isAdmin,
    canViewAll: true, // Todos podem ver
  }
}
