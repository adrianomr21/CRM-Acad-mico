import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log('Iniciando seed do banco de dados...')

  try {
    // Limpar dados existentes (opcional)
    console.log('Limpando dados existentes...')
    await supabase.from('admin_comments').delete().neq('id', 'dummy')
    await supabase.from('extras').delete().neq('id', 'dummy')
    await supabase.from('mc_questions').delete().neq('id', 'dummy')
    await supabase.from('essay_questions').delete().neq('id', 'dummy')
    await supabase.from('evaluations').delete().neq('id', 'dummy')
    await supabase.from('forums').delete().neq('id', 'dummy')
    await supabase.from('assignments').delete().neq('id', 'dummy')
    await supabase.from('quiz_questions').delete().neq('id', 'dummy')
    await supabase.from('quizzes').delete().neq('id', 'dummy')
    await supabase.from('activities').delete().neq('id', 'dummy')
    await supabase.from('materials').delete().neq('id', 'dummy')
    await supabase.from('sessions').delete().neq('id', 'dummy')
    await supabase.from('discipline_templates').delete().neq('id', 'dummy')
    await supabase.from('professor_disciplines').delete().neq('id', 'dummy')
    await supabase.from('disciplines').delete().neq('id', 'dummy')
    await supabase.from('courses').delete().neq('id', 'dummy')
    await supabase.from('users').delete().neq('id', 'dummy')

    // Inserir usuários
    console.log('Inserindo usuários...')
    const { data: users } = await supabase
      .from('users')
      .insert([
        {
          email: 'admin@exemplo.com',
          name: 'Administrador do Sistema',
          role: 'ADMIN',
          is_active: true
        },
        {
          email: 'joao.silva@exemplo.com',
          name: 'Dr. João Silva',
          role: 'PROFESSOR',
          is_active: true
        },
        {
          email: 'maria.santos@exemplo.com',
          name: 'Dra. Maria Santos',
          role: 'PROFESSOR',
          is_active: true
        },
        {
          email: 'pedro.oliveira@exemplo.com',
          name: 'Dr. Pedro Oliveira',
          role: 'PROFESSOR',
          is_active: true
        }
      ])
      .select()

    if (!users) throw new Error('Falha ao inserir usuários')

    // Inserir cursos
    console.log('Inserindo cursos...')
    const { data: courses } = await supabase
      .from('courses')
      .insert([
        {
          name: 'Sistemas de Informação',
          description: 'Curso de Graduação em Sistemas de Informação',
          type: 'GRADUACAO',
          is_active: true
        },
        {
          name: 'Engenharia de Software',
          description: 'Curso de Pós-Graduação em Engenharia de Software',
          type: 'POS_GRADUACAO',
          is_active: true
        },
        {
          name: 'Administração',
          description: 'Curso de Graduação em Administração',
          type: 'GRADUACAO',
          is_active: true
        }
      ])
      .select()

    if (!courses) throw new Error('Falha ao inserir cursos')

    // Inserir disciplinas
    console.log('Inserindo disciplinas...')
    const { data: disciplines } = await supabase
      .from('disciplines')
      .insert([
        {
          name: 'Programação Web',
          code: 'PW101',
          workload: 80,
          course_type: 'GRADUACAO',
          course_id: courses[0].id,
          has_ead_hours: true,
          has_practical_hours: true,
          has_integrated_project: false,
          has_presential_exam: true,
          is_licenciatura: false,
          has_complementary_eval: true,
          has_extension_curriculum: false,
          needs_presential_tool: false,
          status: 'EM_PROGRESSO',
          delivery_date: '2024-12-15',
          created_by: users[0].id
        },
        {
          name: 'Banco de Dados',
          code: 'BD201',
          workload: 60,
          course_type: 'GRADUACAO',
          course_id: courses[0].id,
          has_ead_hours: false,
          has_practical_hours: true,
          has_integrated_project: true,
          has_presential_exam: true,
          is_licenciatura: false,
          has_complementary_eval: true,
          has_extension_curriculum: false,
          needs_presential_tool: true,
          status: 'CONCLUIDA',
          delivery_date: '2024-11-30',
          created_by: users[0].id
        },
        {
          name: 'Inteligência Artificial',
          code: 'IA301',
          workload: 120,
          course_type: 'POS_GRADUACAO',
          course_id: courses[1].id,
          has_ead_hours: true,
          has_practical_hours: true,
          has_integrated_project: true,
          has_presential_exam: false,
          is_licenciatura: false,
          has_complementary_eval: true,
          has_extension_curriculum: true,
          needs_presential_tool: false,
          status: 'ATRASADA',
          delivery_date: '2024-11-15',
          created_by: users[0].id
        }
      ])
      .select()

    if (!disciplines) throw new Error('Falha ao inserir disciplinas')

    // Inserir atribuições de professores
    console.log('Inserindo atribuições de professores...')
    await supabase.from('professor_disciplines').insert([
      {
        professor_id: users[1].id,
        discipline_id: disciplines[0].id,
        status: 'EM_PROGRESSO'
      },
      {
        professor_id: users[2].id,
        discipline_id: disciplines[1].id,
        status: 'CONCLUIDA'
      },
      {
        professor_id: users[3].id,
        discipline_id: disciplines[2].id,
        status: 'ATRASADA'
      }
    ])

    // Inserir templates
    console.log('Inserindo templates...')
    await supabase.from('discipline_templates').insert([
      {
        discipline_id: disciplines[0].id,
        session_name: 'Roteiro',
        numbering_type: 'NUMBERS',
        min_author_materials: 3,
        min_study_activities: 2,
        min_evaluations: 1,
        is_active: true
      },
      {
        discipline_id: disciplines[1].id,
        session_name: 'Roteiro',
        numbering_type: 'NUMBERS',
        min_author_materials: 3,
        min_study_activities: 2,
        min_evaluations: 1,
        is_active: true
      },
      {
        discipline_id: disciplines[2].id,
        session_name: 'Temática',
        numbering_type: 'LETTERS',
        min_author_materials: 5,
        min_study_activities: 3,
        min_evaluations: 2,
        is_active: true
      }
    ])

    // Inserir sessões
    console.log('Inserindo sessões...')
    const { data: sessions } = await supabase
      .from('sessions')
      .insert([
        // Sessões para Programação Web
        {
          discipline_id: disciplines[0].id,
          name: 'Apresentação',
          type: 'APRESENTACAO',
          order: 1,
          is_completed: true
        },
        {
          discipline_id: disciplines[0].id,
          name: 'Roteiro 1',
          type: 'ROTEIRO',
          order: 2,
          is_completed: true
        },
        {
          discipline_id: disciplines[0].id,
          name: 'Roteiro 2',
          type: 'ROTEIRO',
          order: 3,
          is_completed: false
        },
        {
          discipline_id: disciplines[0].id,
          name: 'Avaliação 1',
          type: 'AVALIACAO',
          order: 4,
          is_completed: false
        },
        // Sessões para Banco de Dados
        {
          discipline_id: disciplines[1].id,
          name: 'Apresentação',
          type: 'APRESENTACAO',
          order: 1,
          is_completed: true
        },
        {
          discipline_id: disciplines[1].id,
          name: 'Roteiro 1',
          type: 'ROTEIRO',
          order: 2,
          is_completed: true
        },
        {
          discipline_id: disciplines[1].id,
          name: 'Avaliação 1',
          type: 'AVALIACAO',
          order: 3,
          is_completed: true
        },
        // Sessões para Inteligência Artificial
        {
          discipline_id: disciplines[2].id,
          name: 'Apresentação',
          type: 'APRESENTACAO',
          order: 1,
          is_completed: true
        },
        {
          discipline_id: disciplines[2].id,
          name: 'Roteiro 1',
          type: 'ROTEIRO',
          order: 2,
          is_completed: false
        }
      ])
      .select()

    if (!sessions) throw new Error('Falha ao inserir sessões')

    // Inserir materiais de exemplo
    console.log('Inserindo materiais...')
    await supabase.from('materials').insert([
      {
        session_id: sessions[0].id,
        name: 'Plano de Ensino',
        type: 'BASICO',
        is_authorial: false,
        description: 'Plano de ensino da disciplina'
      },
      {
        session_id: sessions[1].id,
        name: 'Material Básico HTML',
        type: 'BASICO',
        is_authorial: true,
        description: 'Material autoral sobre HTML básico'
      },
      {
        session_id: sessions[1].id,
        name: 'Referência MDN',
        type: 'COMPLEMENTAR',
        is_authorial: false,
        link_url: 'https://developer.mozilla.org'
      }
    ])

    // Inserir atividades de exemplo
    console.log('Inserindo atividades...')
    const { data: activities } = await supabase
      .from('activities')
      .insert([
        {
          session_id: sessions[1].id,
          type: 'TAREFA',
          title: 'Exercício Prático',
          guidance: 'Crie sua primeira página HTML',
          order: 1
        }
      ])
      .select()

    if (!activities) throw new Error('Falha ao inserir atividades')

    // Inserir tarefa
    await supabase.from('assignments').insert([
      {
        activity_id: activities[0].id,
        question: 'Crie uma página HTML completa com estrutura semântica'
      }
    ])

    console.log('Seed concluído com sucesso!')
    console.log('\nDados criados:')
    console.log(`- Usuários: ${users.length}`)
    console.log(`- Cursos: ${courses.length}`)
    console.log(`- Disciplinas: ${disciplines.length}`)
    console.log(`- Sessões: ${sessions.length}`)
    console.log('\nCredenciais de teste:')
    console.log('Admin: admin@exemplo.com')
    console.log('Professor: joao.silva@exemplo.com')

  } catch (error) {
    console.error('Erro durante o seed:', error)
    process.exit(1)
  }
}

seedDatabase()