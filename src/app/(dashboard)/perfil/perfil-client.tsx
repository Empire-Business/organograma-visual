'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { formatarTempoEmpresa } from '@/lib/utils'

interface Cargo {
  id: string
  nome: string
  nivel: number
  descricao?: string
  funcoes?: string[]
  metas?: string[]
}

interface Pessoa {
  id: string
  nome: string
  email: string
  avatar_url?: string | null
  data_inicio?: string
  telefone?: string | null
  cargo_id?: string
  cargos?: Cargo | null
}

interface PerfilClientProps {
  pessoa: Pessoa
  userEmail: string
}

export function PerfilClient({ pessoa, userEmail }: PerfilClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nome: pessoa.nome || '',
    telefone: pessoa.telefone || '',
    avatar_url: pessoa.avatar_url || null
  })

  const handleAvatarUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase
        .from('pessoas')
        .update({
          nome: formData.nome,
          telefone: formData.telefone,
          avatar_url: formData.avatar_url,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', pessoa.id)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()

      // Limpar mensagem de sucesso apos 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil')
    } finally {
      setLoading(false)
    }
  }

  const tempoEmpresa = pessoa.data_inicio
    ? formatarTempoEmpresa(pessoa.data_inicio)
    : null

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Meu Perfil
      </h1>

      <div className="space-y-6">
        {/* Card de Identificacao */}
        <Card padding="lg">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <AvatarUpload
                currentAvatarUrl={formData.avatar_url}
                nome={formData.nome}
                onUploadComplete={handleAvatarUpload}
                onError={(err) => setError(err)}
                size="lg"
              />
            </div>

            {/* Dados */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Nome
                </label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <Input
                  value={userEmail}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-text-secondary mt-1">
                  O email nao pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Telefone
                </label>
                <Input
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Card de Informacoes do Cargo */}
        {pessoa.cargos && (
          <Card padding="lg">
            <h2 className="font-semibold text-text-primary mb-4">
              Cargo e Responsabilidades
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-text-secondary">Cargo</span>
                <p className="font-medium text-text-primary">
                  {pessoa.cargos.nome}
                </p>
              </div>

              {tempoEmpresa && (
                <div>
                  <span className="text-sm text-text-secondary">Tempo de empresa</span>
                  <p className="font-medium text-text-primary">{tempoEmpresa}</p>
                </div>
              )}

              {pessoa.cargos.descricao && (
                <div>
                  <span className="text-sm text-text-secondary">Descricao</span>
                  <p className="text-text-primary">{pessoa.cargos.descricao}</p>
                </div>
              )}

              {pessoa.cargos.funcoes && pessoa.cargos.funcoes.length > 0 && (
                <div>
                  <span className="text-sm text-text-secondary block mb-2">Funcoes</span>
                  <ul className="list-disc list-inside space-y-1">
                    {pessoa.cargos.funcoes.map((funcao, i) => (
                      <li key={i} className="text-text-primary text-sm">{funcao}</li>
                    ))}
                  </ul>
                </div>
              )}

              {pessoa.cargos.metas && pessoa.cargos.metas.length > 0 && (
                <div>
                  <span className="text-sm text-text-secondary block mb-2">Metas</span>
                  <ul className="list-disc list-inside space-y-1">
                    {pessoa.cargos.metas.map((meta, i) => (
                      <li key={i} className="text-text-primary text-sm">{meta}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Mensagens de erro/sucesso */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-600 rounded-lg">
            Perfil atualizado com sucesso!
          </div>
        )}

        {/* Botao Salvar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading || !formData.nome}
          >
            {loading ? 'Salvando...' : 'Salvar alteracoes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
