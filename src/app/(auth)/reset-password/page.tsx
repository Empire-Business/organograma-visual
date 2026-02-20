'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Verificar se o token de recuperacao e valido
    const verifyToken = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (!token || type !== 'recovery') {
        setError('Link invalido ou expirado. Solicite uma nova recuperacao de senha.')
        setVerifying(false)
        return
      }

      try {
        // O Supabase ja processa o token automaticamente via URL hash
        const { error } = await supabase.auth.getSession()
        if (error) {
          setError('Link invalido ou expirado. Solicite uma nova recuperacao de senha.')
        }
      } catch {
        setError('Erro ao verificar link. Tente novamente.')
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams, supabase.auth])

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess(true)

      // Redirecionar para login apos 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch {
      setError('Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
            <p className="text-text-secondary mt-4">Verificando link...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Redefinir Senha
          </h1>
          <p className="text-text-secondary mt-2">
            Digite sua nova senha
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg">
              <p className="font-medium">Senha redefinida com sucesso!</p>
              <p className="text-sm mt-1">
                Redirecionando para o login...
              </p>
            </div>
          </div>
        ) : error && !password ? (
          <div className="text-center space-y-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              <p>{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/forgot-password')}
              className="w-full"
            >
              Solicitar novo link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                Nova Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={!!error}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                Confirmar Nova Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                error={!!error}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
            <p className="text-text-secondary mt-4">Carregando...</p>
          </div>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
