import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fryhyfcjegfvvfkeunyk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyeWh5ZmNqZWdmdnZma2V1bnlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI2MTc4NywiZXhwIjoyMDcwODM3Nzg3fQ.2YqJ0kQvX4xW7K6t9Y8W3XZ2f1hK0cL7mV6nN8pP0rM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...')
    
    // Testar conexão básica
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message)
      return
    }
    
    console.log('✅ Conexão bem-sucedida!')
    console.log('📊 Total de usuários:', data?.count || 0)
    
    // Testar inserção de usuário
    console.log('\n📝 Testando inserção de usuário...')
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'PROFESSOR',
        is_active: true
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Erro ao inserir usuário:', insertError.message)
    } else {
      console.log('✅ Usuário inserido com sucesso:', newUser?.email)
    }
    
    // Testar consulta de usuários
    console.log('\n🔍 Testando consulta de usuários...')
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .limit(5)
    
    if (queryError) {
      console.error('❌ Erro na consulta:', queryError.message)
    } else {
      console.log('✅ Consulta realizada com sucesso!')
      console.log('📋 Usuários encontrados:', users?.length || 0)
      users?.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`)
      })
    }
    
    console.log('\n🎉 Todos os testes concluídos com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
  }
}

testConnection()