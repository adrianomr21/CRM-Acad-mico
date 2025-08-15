# Configuração do Supabase para CRM Acadêmico

## Passos para configurar o Supabase

### 1. Criar um projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações:
   - **Organization**: Seu nome ou nome da organização
   - **Project Name**: `crm-academico` (ou outro nome de sua preferência)
   - **Database Password**: Crie uma senha forte e anote-a
   - **Region**: Escolha a região mais próxima de você
5. Aguarde a criação do projeto (pode levar alguns minutos)

### 2. Obter as credenciais

Após criar o projeto, você precisará das seguintes informações:

1. **Project URL**: 
   - Vá para Project Settings > General
   - Copie o **Project URL**

2. **Anon Key**:
   - Na mesma página, copie o **anon** public key

3. **Service Role Key**:
   - Vá para Project Settings > API
   - Em Project API keys, copie o **service_role** secret key

### 3. Configurar as variáveis de ambiente

No arquivo `.env.local` na raiz do projeto, substitua os placeholders:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### 4. Executar as migrações

Você tem duas opções para criar as tabelas:

#### Opção A: Usar o SQL Editor do Supabase

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo: `supabase/migrations/001_create_tables.sql`
4. Clique em "Run"

#### Opção B: Usar a CLI do Supabase (se você tiver instalada)

```bash
# Instalar a CLI do Supabase (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar ao seu projeto
supabase link --project-ref seu-project-ref

# Executar as migrações
supabase db push
```

### 5. Configurar o Storage (opcional)

Se você quiser usar o Storage do Supabase para upload de arquivos:

1. No painel do Supabase, vá para **Storage**
2. Crie um novo bucket chamado `discipline-files`
3. Configure as políticas de acesso conforme necessário

### 6. Configurar Row Level Security (RLS)

Para maior segurança, configure as políticas de RLS:

1. No painel do Supabase, vá para **Authentication > Policies**
2. Para cada tabela, crie políticas apropriadas
3. Exemplo de política para a tabela `users`:

```sql
-- Permitir que usuários vejam seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);
```

### 7. Testar a conexão

Depois de configurar tudo, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` e verifique se o status do sistema aparece como "Online".

### 8. Criar dados iniciais (opcional)

Para testar o sistema, você pode criar alguns dados iniciais:

```sql
-- Inserir um usuário administrador
INSERT INTO users (email, name, role, is_active) 
VALUES ('admin@exemplo.com', 'Administrador', 'ADMIN', true);

-- Inserir um usuário professor
INSERT INTO users (email, name, role, is_active) 
VALUES ('professor@exemplo.com', 'Professor Teste', 'PROFESSOR', true);

-- Inserir um curso
INSERT INTO courses (name, description, type, is_active) 
VALUES ('Sistemas de Informação', 'Curso de Graduação em Sistemas de Informação', 'GRADUACAO', true);

-- Inserir uma disciplina
INSERT INTO disciplines (name, code, workload, course_type, course_id, created_by) 
VALUES ('Programação Web', 'PW101', 80, 'GRADUACAO', 
        (SELECT id FROM courses WHERE name = 'Sistemas de Informação' LIMIT 1),
        (SELECT id FROM users WHERE email = 'admin@exemplo.com' LIMIT 1));
```

## Solução de Problemas

### Erro de conexão
- Verifique se as credenciais no `.env.local` estão corretas
- Verifique se o projeto Supabase está ativo

### Erro de permissão
- Verifique as políticas de RLS
- Verifique se as chaves de API têm as permissões necessárias

### Erro de tabela não encontrada
- Verifique se as migrações foram executadas corretamente
- Verifique os nomes das tabelas no SQL Editor

## Próximos Passos

Após configurar o Supabase, você pode:

1. Implementar autenticação completa
2. Configurar o Storage para upload de arquivos
3. Adicionar mais políticas de segurança
4. Implementar webhooks para notificações
5. Configurar backups automáticos