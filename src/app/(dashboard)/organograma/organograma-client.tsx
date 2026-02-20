'use client'

import { useState } from 'react'
import { OrganogramaView } from './organograma-view'
import { PersonFormModal } from '@/components/pessoa/person-form-modal'
import { CargoFormModal } from '@/components/cargo/cargo-form-modal'
import { CargosListModal } from '@/components/cargo/cargos-list-modal'
import { createPessoa, updatePessoa, deletePessoa } from '@/lib/actions/pessoas'
import { createCargo, updateCargo, deleteCargo } from '@/lib/actions/cargos'
import { Button } from '@/components/ui/button'

interface Pessoa {
  id: string
  nome: string
  cargo: string
  avatar_url?: string | null
  nivel: number
  reports_to?: string | null
  projetos_ativos?: number
  tarefas_pendentes?: number
  cargo_id?: string | null
  data_inicio?: string | null
}

interface Cargo {
  id: string
  nome: string
  nivel: number
  descricao?: string
  departamento?: string
  funcoes?: string[]
  metas?: string[]
}

interface OrganogramaClientProps {
  pessoas: Pessoa[]
  cargos: Cargo[]
  isDemo: boolean
}

export function OrganogramaClient({ pessoas: initialPessoas, cargos: initialCargos, isDemo }: OrganogramaClientProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>(initialPessoas)
  const [cargos, setCargos] = useState<Cargo[]>(initialCargos)
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showCargoForm, setShowCargoForm] = useState(false)
  const [showCargosList, setShowCargosList] = useState(false)
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null)
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null)
  const [loading, setLoading] = useState(false)

  // --- Pessoa CRUD ---
  const handleSavePessoa = async (data: {
    id?: string
    nome: string
    cargo_id: string
    nivel?: number
    reports_to?: string | null
    data_inicio?: string | null
    avatar_url?: string | null
  }) => {
    setLoading(true)
    try {
      if (data.id) {
        await updatePessoa(data.id, {
          nome: data.nome,
          cargo_id: data.cargo_id,
          reports_to: data.reports_to,
          data_inicio: data.data_inicio,
          avatar_url: data.avatar_url
        })
        setPessoas(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p))
      } else {
        await createPessoa({
          nome: data.nome,
          cargo_id: data.cargo_id,
          reports_to: data.reports_to,
          data_inicio: data.data_inicio,
          avatar_url: data.avatar_url
        })
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePessoa = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta pessoa?')) return

    setLoading(true)
    try {
      await deletePessoa(id)
      setPessoas(prev => prev.filter(p => p.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const handleEditPessoa = (pessoa: Pessoa) => {
    setEditingPessoa(pessoa)
    setShowPersonForm(true)
  }

  // --- Cargo CRUD ---
  const handleSaveCargo = async (data: {
    id?: string
    nome: string
    descricao?: string
    nivel: number
    departamento?: string
    funcoes?: string[]
    metas?: string[]
  }) => {
    setLoading(true)
    try {
      if (data.id) {
        await updateCargo(data.id, data)
        setCargos(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c))
      } else {
        await createCargo(data)
        window.location.reload()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCargo = async (id: string) => {
    await deleteCargo(id)
    setCargos(prev => prev.filter(c => c.id !== id))
  }

  const handleEditCargo = (cargo: Cargo) => {
    setEditingCargo(cargo)
    setShowCargoForm(true)
  }

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="p-6">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Organograma
            </h1>
            <p className="text-text-secondary mt-1">
              Visualize a estrutura da sua empresa
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                Dados de demonstração
              </span>
            )}

            {/* Menu de configurações */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowCargosList(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cargos
              </Button>
            </div>

            <Button onClick={() => {
              setEditingPessoa(null)
              setShowPersonForm(true)
            }}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nova Pessoa
            </Button>
          </div>
        </header>

        <OrganogramaView
          pessoas={pessoas}
          onEdit={handleEditPessoa}
          onDelete={handleDeletePessoa}
        />

        {/* Modal de formulário de pessoa */}
        {showPersonForm && (
          <PersonFormModal
            pessoa={editingPessoa}
            cargos={cargos}
            pessoas={pessoas.map(p => ({ id: p.id, nome: p.nome, nivel: p.nivel }))}
            onClose={() => {
              setShowPersonForm(false)
              setEditingPessoa(null)
            }}
            onSave={handleSavePessoa}
          />
        )}

        {/* Modal de lista de cargos */}
        {showCargosList && (
          <CargosListModal
            cargos={cargos}
            onClose={() => setShowCargosList(false)}
            onEdit={(cargo) => {
              setShowCargosList(false)
              setEditingCargo(cargo)
              setShowCargoForm(true)
            }}
            onDelete={handleDeleteCargo}
          />
        )}

        {/* Modal de formulário de cargo */}
        {showCargoForm && (
          <CargoFormModal
            cargo={editingCargo}
            onClose={() => {
              setShowCargoForm(false)
              setEditingCargo(null)
            }}
            onSave={handleSaveCargo}
          />
        )}
      </div>
    </main>
  )
}
