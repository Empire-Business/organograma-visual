import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Navegação */}
            <div className="flex items-center gap-8">
              <Link href="/organograma" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <span className="font-semibold text-text-primary">
                  Organograma
                </span>
              </Link>

              {/* Navegação */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink href="/organograma">Organograma</NavLink>
                <NavLink href="/projetos">Projetos</NavLink>
              </nav>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary hidden sm:block">
                {session.user.email}
              </span>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent-600 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}
