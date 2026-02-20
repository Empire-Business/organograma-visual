'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SidebarSectionProps {
  title: string
  isExpanded: boolean
  isMobileOpen: boolean
  children: React.ReactNode
  defaultOpen?: boolean
  storageKey?: string
}

export function SidebarSection({
  title,
  isExpanded,
  isMobileOpen,
  children,
  defaultOpen = true,
  storageKey
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Carregar estado do localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`sidebar-section-${storageKey}`)
      if (saved !== null) {
        setIsOpen(saved === 'true')
      }
    }
  }, [storageKey])

  const toggleSection = () => {
    const newValue = !isOpen
    setIsOpen(newValue)
    if (storageKey) {
      localStorage.setItem(`sidebar-section-${storageKey}`, String(newValue))
    }
  }

  // Se sidebar esta recolhida, mostrar sem secoes
  if (!isExpanded && !isMobileOpen) {
    return <>{children}</>
  }

  return (
    <div className="py-2">
      {/* Header da secao */}
      <button
        type="button"
        onClick={toggleSection}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider hover:text-text-secondary dark:hover:text-gray-400 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteudo da secao */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-1">
          {children}
        </div>
      </div>
    </div>
  )
}
