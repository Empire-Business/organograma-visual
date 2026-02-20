'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Role {
  id: string
  nome: string
  descricao?: string | null
  nivel: number
  is_system?: boolean
}

interface Pessoa {
  id: string
  nome: string
  email: string
}

interface Usuario {
  id: string
  user_id: string
  tenant_id: string
  criado_em: string
  roles: Role | Role[] | null
  pessoa?: Pessoa | null
}

interface PermissoesClientProps {
  usuarios: Usuario[]
  roles: Role[]
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  manager: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  member: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

// Helper para extrair role de array ou objeto
function getRole(roles: Role | Role[] | null): Role | null {
  if (!roles) return null
  if (Array.isArray(roles)) return roles[0] || null
  return roles
}

export function PermissoesClient({ usuarios, roles }: PermissoesClientProps) {
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setIsUpdating(true)
    try {
      // TODO: Implementar API de atualização de role
      console.log('Atualizando role:', userId, newRoleId)
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Erro ao atualizar role:', error)
    } finally {
      setIsUpdating(false)
      setSelectedUser(null)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Gerenciar Permissões
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Atribua papéis e permissões aos usuários do sistema
          </p>
        </header>

        {/* Cards de Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map(role => (
            <div
              key={role.id}
              className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize',
                  ROLE_COLORS[role.nome] || 'bg-gray-100 text-gray-700'
                )}>
                  {role.nome}
                </span>
                {role.is_system && (
                  <span className="text-xs text-[var(--muted-foreground)]">
                    (sistema)
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {role.descricao || 'Sem descrição'}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Nível: {role.nivel}
              </p>
            </div>
          ))}
        </div>

        {/* Lista de Usuários */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--foreground)]">
              Usuários do Sistema
            </h2>
          </div>

          {usuarios.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted-foreground)]">
              Nenhum usuário com role atribuído
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {usuarios.map(usuario => (
                <div
                  key={usuario.id}
                  className="p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={null}
                        name={usuario.pessoa?.nome || 'Usuário'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {usuario.pessoa?.nome || 'Usuário sem nome'}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {usuario.pessoa?.email || usuario.user_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedUser?.id === usuario.id ? (
                        <select
                          className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)]"
                          disabled={isUpdating}
                          onChange={(e) => handleRoleChange(usuario.user_id, e.target.value)}
                          defaultValue={getRole(usuario.roles)?.id}
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.nome}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={cn(
                          'inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize',
                          ROLE_COLORS[getRole(usuario.roles)?.nome || ''] || 'bg-gray-100 text-gray-700'
                        )}>
                          {getRole(usuario.roles)?.nome || 'Sem role'}
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(selectedUser?.id === usuario.id ? null : usuario)}
                      >
                        {selectedUser?.id === usuario.id ? 'Cancelar' : 'Editar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Permissões
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Apenas administradores podem alterar permissões. O papel 'admin' tem acesso total ao sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
