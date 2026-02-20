# Acesso ao Supabase - Documentação

## Acordo

O usuário forneceu acesso total ao Supabase para que a IA execute todas as operações de banco de dados (criação de tabelas, migrations, seeds, etc) sem necessidade de intervenção manual.

## Credenciais Disponíveis

As credenciais estão em `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública (anon)
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (admin total)

## O que a IA pode fazer

Com a `SUPABASE_SERVICE_ROLE_KEY`, a IA tem:

- ✅ Criar tabelas
- ✅ Executar migrations
- ✅ Configurar RLS
- ✅ Criar views
- ✅ Inserir dados (seed)
- ✅ Modificar schema
- ✅ Bypassar RLS (acesso total)

## Como funciona

A IA executa operações via:

1. **Scripts Node.js** - Usando `@supabase/supabase-js` com service_role
2. **Supabase REST API** - Chamadas HTTP diretas
3. **SQL via API** - Execução de SQL arbitrário

## Segurança

⚠️ A `SUPABASE_SERVICE_ROLE_KEY` tem acesso TOTAL ao banco:
- Nunca expor no frontend
- Nunca commitar no Git
- Usar apenas em scripts server-side

## Histórico de Operações

| Data | Operação | Status |
|------|----------|--------|
| 2026-02-19 | Setup inicial | Pendente |

---

## Próximos Passos

1. Executar migration inicial (`001_initial_schema.sql`)
2. Verificar se tabelas foram criadas
3. Inserir dados de seed (cargos iniciais)
