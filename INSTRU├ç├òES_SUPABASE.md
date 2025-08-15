# Instruções para Configurar o Supabase

## Passo 1: Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto chamado `crm-academico`
3. Anote as credenciais:
   - Project URL
   - Anon Key
   - Service Role Key

## Passo 2: Configurar Variáveis de Ambiente

No arquivo `.env.local`, substitua:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_servico_aqui
```

## Passo 3: Executar Migrações

1. No painel do Supabase, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo: `supabase/migrations/001_create_tables.sql`
3. Clique em "Run"

## Passo 4: Popular com Dados de Exemplo

Execute o script de seed:

```bash
npm run db:seed
```

## Passo 5: Testar

1. Reinicie o servidor: `npm run dev`
2. Acesse http://localhost:3000
3. Verifique se o status aparece como "Online"

## Credenciais de Teste

- **Admin**: admin@exemplo.com
- **Professor**: joao.silva@exemplo.com
- **Professor**: maria.santos@exemplo.com
- **Professor**: pedro.oliveira@exemplo.com

## Pronto!

O sistema agora está usando Supabase como banco de dados.