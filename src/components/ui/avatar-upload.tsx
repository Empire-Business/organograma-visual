'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  nome: string
  userId?: string
  pessoaId?: string
  onUploadComplete: (url: string) => void
  onError?: (error: string) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function AvatarUpload({
  currentAvatarUrl,
  nome,
  userId,
  pessoaId,
  onUploadComplete,
  onError,
  size = 'lg'
}: AvatarUploadProps) {

  // Usar userId ou pessoaId como identificador
  const storageId = userId || pessoaId || 'default'
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, selecione uma imagem')
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('A imagem deve ter no máximo 5MB')
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
      const fileName = `avatar.${fileExt}`
      const filePath = `${storageId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        })

      if (uploadError) {
        if (uploadError.message.includes('not found')) {
          onError?.('Bucket de avatares não configurado. Entre em contato com o administrador.')
        } else {
          throw uploadError
        }
        return
      }

      // Obter URL pública com timestamp para evitar cache
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const urlWithCache = `${publicUrl}?t=${Date.now()}`
      onUploadComplete(urlWithCache)
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
          sizeClasses[size]
        )}
      >
        <Avatar
          src={displayUrl}
          name={nome}
          size={size}
        />

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

      <span className="text-xs text-[var(--muted-foreground)]">
        {uploading ? 'Enviando...' : 'Clique para alterar'}
      </span>
    </div>
  )
}
