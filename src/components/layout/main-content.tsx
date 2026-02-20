'use client'

import { useEffect, useState } from 'react'

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  useEffect(() => {
    // Check initial state
    const saved = localStorage.getItem('sidebar-expanded')
    if (saved !== null) {
      setSidebarExpanded(saved === 'true')
    }

    // Listen for custom event from sidebar toggle
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarExpanded(e.detail.expanded)
    }

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)

    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    }
  }, [])

  return (
    <main
      className={`min-h-screen transition-all duration-200 pt-14 md:pt-0 ${
        sidebarExpanded ? 'md:pl-60' : 'md:pl-16'
      }`}
    >
      {children}
    </main>
  )
}
