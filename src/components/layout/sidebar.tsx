'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { SidebarSection } from './sidebar-section'

interface SidebarProps {
  userEmail?: string
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Carregar preferencia do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded')
    if (saved !== null) {
      setIsExpanded(saved === 'true')
    }
  }, [])

  // Salvar preferencia no localStorage e disparar evento
  const toggleSidebar = () => {
    const newValue = !isExpanded
    setIsExpanded(newValue)
    localStorage.setItem('sidebar-expanded', String(newValue))
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { expanded: newValue } }))
  }

  // Itens da secao Visao Geral
  const visaoGeralItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      href: '/organograma',
      label: 'Organograma',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      href: '/areas-cargos',
      label: 'Areas e Cargos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    }
  ]

  // Itens da secao Gestao
  const gestaoItems = [
    {
      href: '/colaboradores',
      label: 'Colaboradores',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      href: '/projetos',
      label: 'Projetos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      href: '/processos',
      label: 'Processos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      href: '/tarefas',
      label: 'Tarefas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ]

  const renderNavItem = (item: { href: string; label: string; icon: React.ReactNode; disabled?: boolean }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

    if (item.disabled) {
      return (
        <div
          key={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-[var(--muted-foreground)] opacity-50 cursor-not-allowed',
            !isExpanded && !isMobileOpen && 'justify-center px-2'
          )}
          title={!isExpanded && !isMobileOpen ? item.label : undefined}
        >
          <span className="shrink-0 opacity-50">{item.icon}</span>
          {(isExpanded || isMobileOpen) && (
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          )}
          {(isExpanded || isMobileOpen) && (
            <span className="ml-auto text-xs bg-[var(--muted)] px-2 py-0.5 rounded">
              em breve
            </span>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
          isActive
            ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
            : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
          !isExpanded && !isMobileOpen && 'justify-center px-2'
        )}
        title={!isExpanded && !isMobileOpen ? item.label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {(isExpanded || isMobileOpen) && (
          <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-[var(--card)] rounded-lg shadow-md md:hidden text-[var(--foreground)]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-[var(--card)] border-r border-[var(--border)] z-40',
          'transition-all duration-200 flex flex-col',
          'hidden md:flex',
          isExpanded ? 'w-60' : 'w-16',
          'md:translate-x-0',
          isMobileOpen ? 'translate-x-0 flex w-60' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border)]">
          <Link
            href="/organograma"
            className="flex items-center gap-3"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            {(isExpanded || isMobileOpen) && (
              <span className="font-semibold text-[var(--foreground)] whitespace-nowrap">
                Organograma
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {/* Secao: Visao Geral */}
          <SidebarSection
            title="Visao Geral"
            isExpanded={isExpanded}
            isMobileOpen={isMobileOpen}
            storageKey="visao-geral"
          >
            {visaoGeralItems.map(renderNavItem)}
          </SidebarSection>

          {/* Secao: Gestao */}
          <SidebarSection
            title="Gestao"
            isExpanded={isExpanded}
            isMobileOpen={isMobileOpen}
            storageKey="gestao"
          >
            {gestaoItems.map(renderNavItem)}
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-[var(--border)] space-y-1">
          {/* User info */}
          {(isExpanded || isMobileOpen) && userEmail && (
            <div className="px-3 py-2 text-xs text-[var(--muted-foreground)] truncate">
              {userEmail}
            </div>
          )}

          {/* Perfil */}
          <Link
            href="/perfil"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              pathname === '/perfil'
                ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              !isExpanded && !isMobileOpen && 'justify-center px-2'
            )}
            title={!isExpanded && !isMobileOpen ? 'Meu Perfil' : undefined}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {(isExpanded || isMobileOpen) && (
              <span className="text-sm font-medium whitespace-nowrap">Meu Perfil</span>
            )}
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Admin - Migrations */}
          <Link
            href="/admin/migrations"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              pathname === '/admin/migrations'
                ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              !isExpanded && !isMobileOpen && 'justify-center px-2'
            )}
            title={!isExpanded && !isMobileOpen ? 'Migrations' : undefined}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            {(isExpanded || isMobileOpen) && (
              <span className="text-sm font-medium whitespace-nowrap">Migrations</span>
            )}
          </Link>

          {/* Admin - Permissões */}
          <Link
            href="/admin/permissoes"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              pathname === '/admin/permissoes'
                ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              !isExpanded && !isMobileOpen && 'justify-center px-2'
            )}
            title={!isExpanded && !isMobileOpen ? 'Permissões' : undefined}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {(isExpanded || isMobileOpen) && (
              <span className="text-sm font-medium whitespace-nowrap">Permissões</span>
            )}
          </Link>

          {/* Logout */}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                !isExpanded && !isMobileOpen && 'justify-center px-2'
              )}
              title={!isExpanded && !isMobileOpen ? 'Sair' : undefined}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {(isExpanded || isMobileOpen) && (
                <span className="text-sm font-medium">Sair</span>
              )}
            </button>
          </form>

          {/* Toggle button (desktop only) */}
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              'hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
              'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
              !isExpanded && 'justify-center px-2'
            )}
            title={isExpanded ? 'Recolher' : 'Expandir'}
          >
            {isExpanded ? (
              <>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Recolher</span>
              </>
            ) : (
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile close button inside sidebar */}
      {isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-[var(--card)] rounded-lg shadow-md md:hidden text-[var(--foreground)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  )
}
