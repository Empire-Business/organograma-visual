'use client'

import { usePermissions, RoleLevel } from '@/hooks/use-permissions'

interface PermissionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  permission?: string
  role?: RoleLevel
  requireAdmin?: boolean
}

export function PermissionGuard({
  children,
  fallback = null,
  permission,
  role,
  requireAdmin = false,
}: PermissionGuardProps) {
  const { isLoading, isAdmin, can, hasLevel } = usePermissions()

  if (isLoading) {
    return null
  }

  // Se requer admin, verificar
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>
  }

  // Se requer um role específico
  if (role && !hasLevel(role)) {
    return <>{fallback}</>
  }

  // Se requer uma permissão específica
  if (permission && !can(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
