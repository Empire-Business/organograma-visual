'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    // Dispatch custom event for MainContent to listen
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { expanded: newValue } }))
  }

  const navItems = [
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
    }
  ]

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
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40',
          'transition-all duration-200 flex flex-col',
          // Desktop
          'hidden md:flex',
          isExpanded ? 'w-60' : 'w-16',
          // Mobile
          'md:translate-x-0',
          isMobileOpen ? 'translate-x-0 flex w-60' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <Link
            href="/organograma"
            className="flex items-center gap-3"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            {(isExpanded || isMobileOpen) && (
              <span className="font-semibold text-text-primary whitespace-nowrap">
                Organograma
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent-50 text-accent-600'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
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
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-100 space-y-1">
          {/* User info */}
          {(isExpanded || isMobileOpen) && userEmail && (
            <div className="px-3 py-2 text-xs text-text-muted truncate">
              {userEmail}
            </div>
          )}

          {/* Logout */}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
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
              'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
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
          className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  )
}
