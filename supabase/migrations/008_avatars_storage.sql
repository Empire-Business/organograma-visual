-- ============================================
-- STORAGE - AVATARS BUCKET
-- ============================================

-- Criar bucket de avatars (via API seria melhor, mas aqui fica a documentação)
-- Execute no Supabase Dashboard > Storage ou via API

-- Políticas de storage para avatars
-- 1. Qualquer usuário pode ver avatars
-- 2. Usuários podem fazer upload apenas no próprio diretório

-- Nota: As políticas de storage são criadas via Supabase Dashboard ou API
-- Este arquivo serve como documentação das políticas esperadas

/*
Políticas de Storage esperadas para o bucket 'avatars':

POLICY "avatars_public_select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');

POLICY "avatars_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

POLICY "avatars_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

POLICY "avatars_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
*/

-- Função helper para gerar URL pública do avatar
CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID, filename TEXT DEFAULT 'avatar.jpg')
RETURNS TEXT AS $$
BEGIN
    RETURN 'https://qxjnsdogthizcghahiei.supabase.co/storage/v1/object/public/avatars/' || user_id::text || '/' || filename;
END;
$$ LANGUAGE plpgsql;
