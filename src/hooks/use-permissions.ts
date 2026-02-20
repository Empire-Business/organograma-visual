'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types/database'

export type RoleLevel = 'admin' | 'manager' | 'member'

export interface UserPermissions {
  role: Role | null
  isLoading: boolean
  isAdmin: boolean
  isManager: boolean
  isMember: boolean
  can: (permission: string) => boolean
  hasLevel: (level: RoleLevel) => boolean
}

export function usePermissions(tenantId?: string): UserPermissions {
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setRole(null)
          return
        }

        // Buscar role do usuário
        let query = supabase
          .from('user_roles')
          .select(`
            roles (
              id,
              nome,
              descricao,
              nivel,
              is_system,
              permissoes,
              criado_em
            )
          `)
          .eq('user_id', user.id)

        if (tenantId) {
          query = query.eq('tenant_id', tenantId)
        }

        const { data } = await query.single()

        if (data?.roles) {
          // Supabase retorna como array em joins
          const roleData = Array.isArray(data.roles) ? data.roles[0] : data.roles
          setRole(roleData as Role)
        }
      } catch (error) {
        console.error('Erro ao carregar permissões:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRole()
  }, [supabase, tenantId])

  const hasLevel = useCallback((level: RoleLevel): boolean => {
    if (!role) return false

    const levels: Record<RoleLevel, number> = {
      admin: 1,
      manager: 2,
      member: 3,
    }

    return role.nivel <= levels[level]
  }, [role])

  const can = useCallback((permission: string): boolean => {
    if (!role) return false

    // Admin tem todas as permissões
    if (role.nivel === 1) return true

    // Verificar permissão específica
    const permissoes = role.permissoes as Record<string, boolean>
    if (permissoes && permissoes[permission] !== undefined) {
      return permissoes[permission]
    }

    return false
  }, [role])

  return {
    role,
    isLoading,
    isAdmin: role?.nivel === 1,
    isManager: role?.nivel === 2,
    isMember: role?.nivel === 3,
    can,
    hasLevel,
  }
}
