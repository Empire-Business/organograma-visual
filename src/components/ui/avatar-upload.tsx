'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  nome: string
  onUploadComplete: (url: string) => void
  onError?: (error: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarUpload({
  currentAvatarUrl,
  nome,
  onUploadComplete,
  onError,
  size = 'md'
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-xl',
    lg: 'w-32 h-32 text-3xl'
  }

  // Gerar iniciais do nome
  const iniciais = nome
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Gerar cor baseada no nome
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-violet-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-amber-500',
      'bg-rose-500',
      'bg-cyan-500',
      'bg-indigo-500',
      'bg-emerald-500'
    ]
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, selecione uma imagem')
      return
    }

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      onError?.('A imagem deve ter no maximo 2MB')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload para Supabase Storage
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        // Se o bucket nao existe, tentar criar
        if (uploadError.message.includes('not found')) {
          onError?.('Bucket de avatares nao configurado. Entre em contato com o administrador.')
        } else {
          throw uploadError
        }
        return
      }

      // Obter URL publica
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Erro no upload:', error)
      onError?.('Erro ao fazer upload da imagem')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = preview || currentAvatarUrl

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={cn(
          'relative rounded-full overflow-hidden transition-all duration-200',
          'hover:ring-4 hover:ring-accent-500/30',
          'focus:outline-none focus:ring-4 focus:ring-accent-500/50',
          sizeClasses[size],
          !displayUrl && getColorFromName(nome || 'U')
        )}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={nome || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-medium flex items-center justify-center w-full h-full">
            {iniciais || '?'}
          </span>
        )}

        {/* Overlay no hover */}
        <div className={cn(
          'absolute inset-0 bg-black/40 flex items-center justify-center',
          'opacity-0 hover:opacity-100 transition-opacity',
          uploading && 'opacity-100'
        )}>
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <span className="text-xs text-text-secondary">
        {uploading ? 'Enviando...' : 'Clique para alterar'}
      </span>
    </div>
  )
}
